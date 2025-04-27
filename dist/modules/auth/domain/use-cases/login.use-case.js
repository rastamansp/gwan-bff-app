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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUseCase = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../services/user.service");
const base_use_case_1 = require("../../../../core/domain/use-cases/base.use-case");
let LoginUseCase = class LoginUseCase extends base_use_case_1.BaseUseCase {
    constructor(userService) {
        super(userService);
        this.userService = userService;
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
        if (!user.isVerified) {
            throw new common_1.BadRequestException({
                message: 'Usuário não está verificado',
                code: 'USER_NOT_VERIFIED',
                details: {
                    email: data.email
                }
            });
        }
        const loginCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10);
        await this.userService.updateLoginCode(user.id, loginCode, expiresAt);
        console.log(`Código de login: ${loginCode}`);
        return user;
    }
};
exports.LoginUseCase = LoginUseCase;
exports.LoginUseCase = LoginUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], LoginUseCase);
//# sourceMappingURL=login.use-case.js.map