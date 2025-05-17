import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './presentation/controllers/users.controller';
import { GetUserUseCase } from './application/use-cases/get-user.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { ListUsersUseCase } from './application/use-cases/list-users.use-case';
import { MongoDBUserRepository } from './infrastructure/repositories/mongodb-user.repository';
import { IUserRepository } from './domain/repositories/user.repository.interface';
import { User, UserSchema } from '../auth/domain/entities/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema,
                collection: 'users'
            },
        ]),
        AuthModule,
    ],
    controllers: [UsersController],
    providers: [
        GetUserUseCase,
        UpdateUserUseCase,
        ListUsersUseCase,
        {
            provide: 'IUserRepository',
            useClass: MongoDBUserRepository,
        },
    ],
    exports: ['IUserRepository'],
})
export class UsersModule { } 