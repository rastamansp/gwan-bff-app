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
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const rabbitmq_service_1 = require("./rabbitmq.service");
let NotificationService = class NotificationService {
    constructor(rabbitMQService) {
        this.rabbitMQService = rabbitMQService;
    }
    async sendEmail(to, subject, content) {
        try {
            const emailData = {
                to,
                subject,
                content,
                timestamp: new Date().toISOString()
            };
            await this.rabbitMQService.sendToQueue('email_notifications', emailData);
            console.log(`[Email] Mensagem enfileirada para: ${to}`);
        }
        catch (error) {
            console.error('[Email] Erro ao enfileirar mensagem:', error);
            throw error;
        }
    }
    async sendWhatsApp(to, message) {
        try {
            const whatsappData = {
                to,
                message,
                timestamp: new Date().toISOString()
            };
            await this.rabbitMQService.sendToQueue('whatsapp_notifications', whatsappData);
            console.log(`[WhatsApp] Mensagem enfileirada para: ${to}`);
        }
        catch (error) {
            console.error('[WhatsApp] Erro ao enfileirar mensagem:', error);
            throw error;
        }
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [rabbitmq_service_1.RabbitMQService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map