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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const register_use_case_1 = require("../../domain/use-cases/register.use-case");
const verify_code_use_case_1 = require("../../domain/use-cases/verify-code.use-case");
const login_use_case_1 = require("../../domain/use-cases/login.use-case");
const verify_login_use_case_1 = require("../../domain/use-cases/verify-login.use-case");
let AuthController = class AuthController {
    constructor(registerUseCase, verifyCodeUseCase, loginUseCase, verifyLoginUseCase) {
        this.registerUseCase = registerUseCase;
        this.verifyCodeUseCase = verifyCodeUseCase;
        this.loginUseCase = loginUseCase;
        this.verifyLoginUseCase = verifyLoginUseCase;
    }
    async register(data) {
        return this.registerUseCase.execute(data);
    }
    async verify(data) {
        return this.verifyCodeUseCase.execute(data);
    }
    async login(data) {
        return this.loginUseCase.execute(data);
    }
    async verifyLogin(data) {
        return this.verifyLoginUseCase.execute(data);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string', example: 'Pedro Almeida' },
                email: { type: 'string', example: 'pedro.hp.almeida@gmail.com' },
                whatsapp: { type: 'string', example: '+5511999999999' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'User registered successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('verify'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify activation code' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'pedro.hp.almeida@gmail.com' },
                code: { type: 'string', example: '123456' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Code verified successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid code' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verify", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Request login' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'pedro.hp.almeida@gmail.com' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Login code sent successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid credentials' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('verify-login'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify login code' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'pedro.hp.almeida@gmail.com' },
                code: { type: 'string', example: '123456' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Login successful' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid code' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyLogin", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [register_use_case_1.RegisterUseCase,
        verify_code_use_case_1.VerifyCodeUseCase,
        login_use_case_1.LoginUseCase,
        verify_login_use_case_1.VerifyLoginUseCase])
], AuthController);
//# sourceMappingURL=auth.controller.js.map