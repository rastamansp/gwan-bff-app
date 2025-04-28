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
exports.RabbitMQService = void 0;
const common_1 = require("@nestjs/common");
const amqp = require("amqplib");
let RabbitMQService = class RabbitMQService {
    constructor() {
        this.connect();
    }
    async connect() {
        try {
            const conn = await amqp.connect('amqp://root:pazdeDeus2025@rabbitmq.gwan.com.br');
            this.connection = conn;
            const ch = await conn.createChannel();
            this.channel = ch;
            await this.channel.assertQueue('email_notifications', { durable: true });
            await this.channel.assertQueue('whatsapp_notifications', { durable: true });
            console.log('[RabbitMQ] Conectado com sucesso');
        }
        catch (error) {
            console.error('[RabbitMQ] Erro ao conectar:', error);
            setTimeout(() => this.connect(), 5000);
        }
    }
    async sendToQueue(queue, message) {
        try {
            if (!this.channel) {
                await this.connect();
            }
            const messageBuffer = Buffer.from(JSON.stringify(message));
            await this.channel.sendToQueue(queue, messageBuffer, {
                persistent: true
            });
            console.log(`[RabbitMQ] Mensagem enviada para a fila ${queue}`);
        }
        catch (error) {
            console.error(`[RabbitMQ] Erro ao enviar mensagem para a fila ${queue}:`, error);
            throw error;
        }
    }
    async closeConnection() {
        try {
            if (this.channel) {
                await this.channel.close();
            }
            if (this.connection) {
                const conn = this.connection;
                await conn.close();
            }
        }
        catch (error) {
            console.error('[RabbitMQ] Erro ao fechar conexão:', error);
        }
    }
};
exports.RabbitMQService = RabbitMQService;
exports.RabbitMQService = RabbitMQService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RabbitMQService);
//# sourceMappingURL=rabbitmq.service.js.map