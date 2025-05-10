import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileController } from './presentation/controllers/profile.controller';
import { UpdateProfileUseCase } from './application/use-cases/update-profile.use-case';
import { GetUserProfileUseCase } from './application/use-cases/get-user-profile.use-case';
import { UserRepository } from './infrastructure/repositories/mongodb-user.repository';
import { IUserRepository } from './domain/repositories/user.repository.interface';
import { User, UserSchema } from './domain/entities/user.entity';
import { USER_REPOSITORY } from './domain/tokens/injection.tokens';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
        ]),
        AuthModule,
    ],
    controllers: [ProfileController],
    providers: [
        UpdateProfileUseCase,
        GetUserProfileUseCase,
        {
            provide: USER_REPOSITORY,
            useClass: UserRepository,
        },
    ],
    exports: [USER_REPOSITORY],
})
export class ProfileModule { } 