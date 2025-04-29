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
var NotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const rabbitmq_service_1 = require("./rabbitmq.service");
let NotificationService = NotificationService_1 = class NotificationService {
    constructor(rabbitMQService) {
        this.rabbitMQService = rabbitMQService;
        this.logger = new common_1.Logger(NotificationService_1.name);
    }
    async sendEmail(to, subject, content) {
        try {
            this.logger.log(`Preparando envio de email para: ${to}`);
            const emailData = {
                to,
                subject,
                content,
                timestamp: new Date().toISOString()
            };
            this.logger.log(`Enviando mensagem para fila email_notifications: ${JSON.stringify(emailData)}`);
            await this.rabbitMQService.sendToQueue('email_notifications', emailData);
            this.logger.log(`Mensagem enviada com sucesso para fila email_notifications`);
        }
        catch (error) {
            this.logger.error(`Erro ao enviar email para ${to}:`, error);
            throw error;
        }
    }
    async sendWhatsApp(to, message) {
        try {
            this.logger.log(`Preparando envio de WhatsApp para: ${to}`);
            const whatsappData = {
                to,
                message,
                timestamp: new Date().toISOString()
            };
            this.logger.log(`Enviando mensagem para fila whatsapp_notifications: ${JSON.stringify(whatsappData)}`);
            await this.rabbitMQService.sendToQueue('whatsapp_notifications', whatsappData);
            this.logger.log(`Mensagem enviada com sucesso para fila whatsapp_notifications`);
        }
        catch (error) {
            this.logger.error(`Erro ao enviar WhatsApp para ${to}:`, error);
            throw error;
        }
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [rabbitmq_service_1.RabbitMQService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map