import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { AuthController } from "./infrastructure/controllers/auth.controller";
import { User, UserSchema } from "./domain/entities/user.entity";
import { MongooseUserRepository } from "./infrastructure/repositories/mongoose-user.repository";
import { RegisterUseCase } from "./domain/use-cases/register.use-case";
import { LoginUseCase } from "./domain/use-cases/login.use-case";
import { VerifyCodeUseCase } from "./domain/use-cases/verify-code.use-case";
import { VerifyLoginCodeUseCase } from "./domain/use-cases/verify-login-code.use-case";
import { UserService } from "./domain/services/user.service";
import { NotificationService } from "./domain/services/notification.service";
import { RabbitMQService } from "./domain/services/rabbitmq.service";

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || "your-secret-key",
      signOptions: { expiresIn: "1d" },
    }),
  ],
  controllers: [AuthController],
  providers: [
    RegisterUseCase,
    LoginUseCase,
    VerifyCodeUseCase,
    VerifyLoginCodeUseCase,
    NotificationService,
    RabbitMQService,
    UserService,
    {
      provide: 'IUserRepository',
      useClass: MongooseUserRepository,
    },
  ],
  exports: [UserService],
})
export class AuthModule { }
