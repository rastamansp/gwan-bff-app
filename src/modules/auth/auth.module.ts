import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./infrastructure/controllers/auth.controller";
import { UserService } from "./domain/services/user.service";
import { RegisterUseCase } from "./domain/use-cases/register.use-case";
import { VerifyCodeUseCase } from "./domain/use-cases/verify-code.use-case";
import { LoginUseCase } from "./domain/use-cases/login.use-case";
import { VerifyLoginUseCase } from "./domain/use-cases/verify-login.use-case";
import { UserRepositoryImpl } from "./infrastructure/repositories/user.repository.impl";
import { User, UserSchema } from "./domain/entities/user.entity";
import { NotificationService } from "./domain/services/notification.service";
import { RabbitMQService } from "./domain/services/rabbitmq.service";
import JwtStrategy from "./infrastructure/strategies/jwt.strategy";
import { JwtAuthGuard } from "./infrastructure/guards/jwt-auth.guard";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || "gwan-secret-key-production-2024",
      signOptions: { expiresIn: process.env.JWT_EXPIRATION || "1d" },
    }),
  ],
  controllers: [AuthController],
  providers: [
    UserService,
    RegisterUseCase,
    VerifyCodeUseCase,
    LoginUseCase,
    VerifyLoginUseCase,
    UserRepositoryImpl,
    NotificationService,
    RabbitMQService,
    JwtStrategy,
    JwtAuthGuard,
    {
      provide: "IUserRepository",
      useClass: UserRepositoryImpl,
    },
  ],
  exports: [UserService, JwtStrategy, JwtAuthGuard],
})
export class AuthModule { }
