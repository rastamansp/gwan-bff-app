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
var LoginUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUseCase = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../services/user.service");
const notification_service_1 = require("../services/notification.service");
const base_use_case_1 = require("../../../../core/domain/use-cases/base.use-case");
let LoginUseCase = LoginUseCase_1 = class LoginUseCase extends base_use_case_1.BaseUseCase {
    constructor(userService, notificationService) {
        super(userService);
        this.userService = userService;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(LoginUseCase_1.name);
    }
    async execute(data) {
        this.logger.log(`[Login] Iniciando processo de login para: ${data.email}`);
        try {
            this.logger.debug(`[Login] Buscando usuário por email: ${data.email}`);
            const user = await this.userService.findByEmail(data.email);
            if (!user) {
                this.logger.warn(`[Login] Usuário não encontrado: ${data.email}`);
                throw new common_1.NotFoundException({
                    message: "Usuário não encontrado",
                    code: "USER_NOT_FOUND",
                    details: {
                        email: data.email,
                    },
                });
            }
            if (!user.isVerified) {
                this.logger.warn(`[Login] Tentativa de login com usuário não verificado: ${data.email}`);
                throw new common_1.BadRequestException({
                    message: "Usuário não está verificado",
                    code: "USER_NOT_VERIFIED",
                    details: {
                        email: data.email,
                    },
                });
            }
            const loginCode = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + 10);
            this.logger.debug(`[Login] Gerando código de login para usuário: ${user.id}`);
            await this.userService.updateLoginCode(user.id, loginCode, expiresAt);
            this.logger.debug(`[Login] Código de login gerado e salvo. Expira em: ${expiresAt.toISOString()}`);
            this.logger.log(`[Login] Iniciando envio de código por email: ${user.email}`);
            try {
                await this.notificationService.sendEmail(user.email, "Código de Login - GWAN", `Olá ${user.name},\n\nSeu código de login é: ${loginCode}\n\nEste código é válido por 10 minutos.\n\nSe você não solicitou este código, ignore este email.`);
                this.logger.log(`[Login] Email com código de login enviado com sucesso: ${user.email}`);
            }
            catch (error) {
                this.logger.error(`[Login] Erro ao enviar email com código de login: ${error.message}`, error.stack);
                throw new common_1.BadRequestException({
                    message: "Erro ao enviar código de login por email",
                    code: "EMAIL_SEND_ERROR",
                    details: {
                        email: user.email,
                    },
                });
            }
            this.logger.log(`[Login] Iniciando envio de código por WhatsApp: ${user.whatsapp}`);
            try {
                await this.notificationService.sendWhatsApp(user.whatsapp, `GWAN: Seu código de login é: ${loginCode}. Válido por 10 minutos.`);
                this.logger.log(`[Login] Mensagem WhatsApp enviada com sucesso: ${user.whatsapp}`);
            }
            catch (error) {
                this.logger.error(`[Login] Erro ao enviar mensagem WhatsApp: ${error.message}`, error.stack);
            }
            this.logger.log(`[Login] Processo de login concluído com sucesso para: ${user.email}`);
            return user;
        }
        catch (error) {
            this.logger.error(`[Login] Erro durante o processo de login: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.LoginUseCase = LoginUseCase;
exports.LoginUseCase = LoginUseCase = LoginUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        notification_service_1.NotificationService])
], LoginUseCase);
//# sourceMappingURL=login.use-case.js.map