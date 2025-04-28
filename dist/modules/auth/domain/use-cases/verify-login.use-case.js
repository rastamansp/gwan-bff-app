"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyLoginUseCase = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../services/user.service");
const base_use_case_1 = require("../../../../core/domain/use-cases/base.use-case");
const jwt_1 = require("@nestjs/jwt");
let VerifyLoginUseCase = class VerifyLoginUseCase extends base_use_case_1.BaseUseCase {
    constructor(userService, jwtService) {
        super(userService);
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async execute(data) {
        const user = await this.userService.findByEmail(data.email);
        if (!user) {
            throw new common_1.NotFoundException({
                message: 'Usuário não encontrado',
                code: 'USER_NOT_FOUND',
                details: {
                    email: data.email
                }
            });
        }
        if (!user.loginCode || !user.loginCodeExpiresAt) {
            throw new common_1.BadRequestException({
                message: 'Código de login não encontrado',
                code: 'LOGIN_CODE_NOT_FOUND',
                details: {
                    email: data.email
                }
            });
        }
        if (user.loginCode !== data.code) {
            throw new common_1.BadRequestException({
                message: 'Código de login inválido',
                code: 'INVALID_LOGIN_CODE',
                details: {
                    email: data.email,
                    providedCode: data.code
                }
            });
        }
        if (user.loginCodeExpiresAt < new Date()) {
            throw new common_1.BadRequestException({
                message: 'Código de login expirado',
                code: 'LOGIN_CODE_EXPIRED',
                details: {
                    email: data.email,
                    expiresAt: user.loginCodeExpiresAt
                }
            });
        }
        const updatedUser = await this.userService.updateLastLogin(user.id);
        const token = this.jwtService.sign({
            sub: updatedUser.id,
            email: updatedUser.email,
            name: updatedUser.name
        });
        return {
            user: updatedUser,
            token
        };
    }
};
exports.VerifyLoginUseCase = VerifyLoginUseCase;
exports.VerifyLoginUseCase = VerifyLoginUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService, typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object])
], VerifyLoginUseCase);
//# sourceMappingURL=verify-login.use-case.js.map