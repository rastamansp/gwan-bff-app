"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const jwt_1 = require("@nestjs/jwt");
const auth_controller_1 = require("./infrastructure/controllers/auth.controller");
const user_service_1 = require("./domain/services/user.service");
const register_use_case_1 = require("./domain/use-cases/register.use-case");
const verify_code_use_case_1 = require("./domain/use-cases/verify-code.use-case");
const login_use_case_1 = require("./domain/use-cases/login.use-case");
const verify_login_use_case_1 = require("./domain/use-cases/verify-login.use-case");
const user_repository_impl_1 = require("./infrastructure/repositories/user.repository.impl");
const user_entity_1 = require("./domain/entities/user.entity");
const notification_service_1 = require("./domain/services/notification.service");
const rabbitmq_service_1 = require("./domain/services/rabbitmq.service");
const jwt_strategy_1 = require("./infrastructure/strategies/jwt.strategy");
const jwt_auth_guard_1 = require("./infrastructure/guards/jwt-auth.guard");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: user_entity_1.User.name, schema: user_entity_1.UserSchema }]),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'gwan-secret-key-production-2024',
                signOptions: { expiresIn: process.env.JWT_EXPIRATION || '1d' },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            user_service_1.UserService,
            register_use_case_1.RegisterUseCase,
            verify_code_use_case_1.VerifyCodeUseCase,
            login_use_case_1.LoginUseCase,
            verify_login_use_case_1.VerifyLoginUseCase,
            user_repository_impl_1.UserRepositoryImpl,
            notification_service_1.NotificationService,
            rabbitmq_service_1.RabbitMQService,
            jwt_strategy_1.JwtStrategy,
            jwt_auth_guard_1.JwtAuthGuard,
            {
                provide: 'IUserRepository',
                useClass: user_repository_impl_1.UserRepositoryImpl,
            },
        ],
        exports: [user_service_1.UserService, jwt_strategy_1.JwtStrategy, jwt_auth_guard_1.JwtAuthGuard],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map