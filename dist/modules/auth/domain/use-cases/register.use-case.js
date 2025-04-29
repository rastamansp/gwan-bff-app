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
var RegisterUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUseCase = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../services/user.service");
const notification_service_1 = require("../services/notification.service");
const base_use_case_1 = require("../../../../core/domain/use-cases/base.use-case");
let RegisterUseCase = RegisterUseCase_1 = class RegisterUseCase extends base_use_case_1.BaseUseCase {
    constructor(userService, notificationService) {
        super(userService);
        this.userService = userService;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(RegisterUseCase_1.name);
    }
    async execute(data) {
        this.logger.log(`[Register] Iniciando fluxo de registro para usuário: ${data.email}`);
        this.logger.debug(`[Register] Dados de registro recebidos: ${JSON.stringify({
            name: data.name,
            email: data.email,
            whatsapp: data.whatsapp
        })}`);
        try {
            this.logger.debug(`[Register] Verificando se email já está em uso: ${data.email}`);
            const existingUser = await this.userService.findByEmail(data.email);
            if (existingUser) {
                this.logger.warn(`[Register] Tentativa de registro com email já existente: ${data.email}`);
                throw new common_1.ConflictException({
                    message: 'Email já está em uso',
                    code: 'EMAIL_ALREADY_EXISTS',
                    details: {
                        email: data.email
                    }
                });
            }
            this.logger.debug(`[Register] Email disponível para uso: ${data.email}`);
            this.logger.debug(`[Register] Verificando se WhatsApp já está em uso: ${data.whatsapp}`);
            const existingWhatsapp = await this.userService.findByWhatsapp(data.whatsapp);
            if (existingWhatsapp) {
                this.logger.warn(`[Register] Tentativa de registro com WhatsApp já existente: ${data.whatsapp}`);
                throw new common_1.ConflictException({
                    message: 'WhatsApp já está em uso',
                    code: 'WHATSAPP_ALREADY_EXISTS',
                    details: {
                        whatsapp: data.whatsapp
                    }
                });
            }
            this.logger.debug(`[Register] WhatsApp disponível para uso: ${data.whatsapp}`);
            this.logger.log(`[Register] Criando novo usuário no banco de dados: ${data.email}`);
            const user = await this.userService.create({
                ...data,
                isActive: true,
                isVerified: false,
            });
            this.logger.log(`[Register] Usuário criado com sucesso. ID: ${user.id}, Email: ${user.email}`);
            const activationCode = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + 10);
            this.logger.debug(`[Register] Gerando código de verificação para usuário: ${user.id}`);
            await this.userService.updateActivationCode(user.id, activationCode, expiresAt);
            this.logger.debug(`[Register] Código de verificação gerado e salvo. Expira em: ${expiresAt.toISOString()}`);
            this.logger.log(`[Register] Iniciando envio de código por email: ${user.email}`);
            try {
                await this.notificationService.sendEmail(user.email, 'Código de Verificação - GWAN', `Olá ${user.name},\n\nSeu código de verificação é: ${activationCode}\n\nEste código é válido por 10 minutos.`);
                this.logger.log(`[Register] Email de verificação enviado com sucesso: ${user.email}`);
            }
            catch (error) {
                this.logger.error(`[Register] Erro ao enviar email de verificação: ${error.message}`, error.stack);
            }
            this.logger.log(`[Register] Iniciando envio de código por WhatsApp: ${user.whatsapp}`);
            try {
                await this.notificationService.sendWhatsApp(user.whatsapp, `GWAN: Seu código de verificação é: ${activationCode}. Válido por 10 minutos.`);
                this.logger.log(`[Register] Mensagem WhatsApp enviada com sucesso: ${user.whatsapp}`);
            }
            catch (error) {
                this.logger.error(`[Register] Erro ao enviar mensagem WhatsApp: ${error.message}`, error.stack);
            }
            this.logger.log(`[Register] Processo de registro concluído com sucesso para: ${user.email}`);
            return user;
        }
        catch (error) {
            this.logger.error(`[Register] Erro durante o processo de registro: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.RegisterUseCase = RegisterUseCase;
exports.RegisterUseCase = RegisterUseCase = RegisterUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        notification_service_1.NotificationService])
], RegisterUseCase);
//# sourceMappingURL=register.use-case.js.map