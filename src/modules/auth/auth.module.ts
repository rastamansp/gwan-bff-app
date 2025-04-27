import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { UserService } from './domain/services/user.service';
import { RegisterUseCase } from './domain/use-cases/register.use-case';
import { VerifyCodeUseCase } from './domain/use-cases/verify-code.use-case';
import { LoginUseCase } from './domain/use-cases/login.use-case';
import { VerifyLoginUseCase } from './domain/use-cases/verify-login.use-case';
import { UserRepositoryImpl } from './infrastructure/repositories/user.repository.impl';
import { User, UserSchema } from './domain/entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [
    UserService,
    RegisterUseCase,
    VerifyCodeUseCase,
    LoginUseCase,
    VerifyLoginUseCase,
    UserRepositoryImpl,
    {
      provide: 'IUserRepository',
      useClass: UserRepositoryImpl,
    },
  ],
  exports: [UserService],
})
export class AuthModule {} 