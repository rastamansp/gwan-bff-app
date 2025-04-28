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
exports.RegisterUseCase = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../services/user.service");
const notification_service_1 = require("../services/notification.service");
const base_use_case_1 = require("../../../../core/domain/use-cases/base.use-case");
let RegisterUseCase = class RegisterUseCase extends base_use_case_1.BaseUseCase {
    constructor(userService, notificationService) {
        super(userService);
        this.userService = userService;
        this.notificationService = notificationService;
    }
    async execute(data) {
        const existingUser = await this.userService.findByEmail(data.email);
        if (existingUser) {
            throw new common_1.ConflictException({
                message: 'Email já está em uso',
                code: 'EMAIL_ALREADY_EXISTS',
                details: {
                    email: data.email
                }
            });
        }
        const existingWhatsapp = await this.userService.findByWhatsapp(data.whatsapp);
        if (existingWhatsapp) {
            throw new common_1.ConflictException({
                message: 'WhatsApp já está em uso',
                code: 'WHATSAPP_ALREADY_EXISTS',
                details: {
                    whatsapp: data.whatsapp
                }
            });
        }
        const user = await this.userService.create({
            ...data,
            isActive: true,
            isVerified: false,
        });
        const activationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10);
        await this.userService.updateActivationCode(user.id, activationCode, expiresAt);
        await this.notificationService.sendEmail(user.email, 'Código de Verificação - GWAN', `Olá ${user.name},\n\nSeu código de verificação é: ${activationCode}\n\nEste código é válido por 10 minutos.`);
        await this.notificationService.sendWhatsApp(user.whatsapp, `GWAN: Seu código de verificação é: ${activationCode}. Válido por 10 minutos.`);
        return user;
    }
};
exports.RegisterUseCase = RegisterUseCase;
exports.RegisterUseCase = RegisterUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        notification_service_1.NotificationService])
], RegisterUseCase);
//# sourceMappingURL=register.use-case.js.map