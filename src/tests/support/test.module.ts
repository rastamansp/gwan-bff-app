import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User, UserSchema } from '../../modules/auth/domain/entities/user.entity';
import { UserService } from '../../modules/auth/domain/services/user.service';
import { MongooseUserRepository } from '../../modules/auth/infrastructure/repositories/mongoose-user.repository';
import configuration from '../../config/configuration';
import { AuthModule } from '../../modules/auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const uri = configService.get("database.uri");

                // Substitui o nome do banco de dados por 'gwan-test'
                //const testUri = uri.replace(/\/([^/]+)$/, '/gwan-test');

                return {
                    uri: uri,
                    serverSelectionTimeoutMS: 10000,
                    socketTimeoutMS: 45000,
                    connectTimeoutMS: 10000,
                    retryWrites: true,
                    retryReads: true,
                };
            },
            inject: [ConfigService],
        }),
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema }
        ]),
        AuthModule,
    ],
    providers: [
        UserService,
        {
            provide: 'IUserRepository',
            useClass: MongooseUserRepository,
        },
    ],
    exports: [UserService],
})
export class TestModule { } 