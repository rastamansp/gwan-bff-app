import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { AuthController } from "./presentation/controllers/auth.controller";
import { User, UserSchema } from "./domain/entities/user.entity";
import { MongooseUserRepository } from "./infrastructure/repositories/mongoose-user.repository";
import { RegisterUseCase } from "./application/use-cases/register.use-case";
import { LoginUseCase } from "./application/use-cases/login.use-case";
import { VerifyCodeUseCase } from "./application/use-cases/verify-code.use-case";
import { VerifyLoginCodeUseCase } from "./application/use-cases/verify-login-code.use-case";
import { UserService } from "./domain/services/user.service";
import { NotificationService } from "./domain/services/notification.service";
import { RabbitMQService } from "./domain/services/rabbitmq.service";
import { JwtStrategy } from "./infrastructure/strategies/jwt.strategy";
import { JwtAuthGuard } from "./infrastructure/guards/jwt-auth.guard";

const JWT_SECRET = process.env.JWT_SECRET || "gwan-secret-key-production-2024";

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: JWT_SECRET,
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
    JwtStrategy,
    JwtAuthGuard,
    {
      provide: 'IUserRepository',
      useClass: MongooseUserRepository,
    },
  ],
  exports: [UserService, JwtStrategy, JwtAuthGuard],
})
export class AuthModule { }
