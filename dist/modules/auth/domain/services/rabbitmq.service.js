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
var RabbitMQService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const amqp = require("amqplib");
let RabbitMQService = RabbitMQService_1 = class RabbitMQService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(RabbitMQService_1.name);
        this.connect();
    }
    async connect() {
        try {
            this.logger.log("Iniciando conexão com RabbitMQ...");
            const rabbitmqUri = this.configService.get("RABBITMQ_URL");
            if (!rabbitmqUri) {
                throw new Error("RABBITMQ_URI não está definida nas variáveis de ambiente");
            }
            const conn = await amqp.connect(rabbitmqUri);
            this.connection = conn;
            const ch = await conn.createChannel();
            this.channel = ch;
            this.logger.log("Declarando filas...");
            await this.channel.assertQueue("email_notifications", {
                durable: true,
                arguments: {
                    "x-message-ttl": 86400000,
                    "x-dead-letter-exchange": "email_notifications_dlx",
                    "x-dead-letter-routing-key": "email_notifications",
                },
            });
            await this.channel.assertQueue("whatsapp_notifications", {
                durable: true,
            });
            this.logger.log("Filas declaradas com sucesso");
            this.logger.log("[RabbitMQ] Conectado com sucesso");
        }
        catch (error) {
            this.logger.error("[RabbitMQ] Erro ao conectar:", error);
            this.logger.log("[RabbitMQ] Tentando reconectar em 5 segundos...");
            setTimeout(() => this.connect(), 5000);
        }
    }
    async sendToQueue(queue, message) {
        try {
            this.logger.log(`Verificando conexão com RabbitMQ para envio à fila ${queue}...`);
            if (!this.channel) {
                this.logger.log("Canal não encontrado, tentando reconectar...");
                await this.connect();
            }
            const messageBuffer = Buffer.from(JSON.stringify(message));
            this.logger.debug(`Enviando mensagem para fila ${queue}: ${messageBuffer.toString()}`);
            await this.channel.sendToQueue(queue, messageBuffer, {
                persistent: true,
            });
            this.logger.log(`[RabbitMQ] Mensagem enviada com sucesso para a fila ${queue}`);
        }
        catch (error) {
            this.logger.error(`[RabbitMQ] Erro ao enviar mensagem para a fila ${queue}:`, error);
            throw error;
        }
    }
    async closeConnection() {
        try {
            this.logger.log("Fechando conexão com RabbitMQ...");
            if (this.channel) {
                await this.channel.close();
                this.logger.log("Canal fechado com sucesso");
            }
            if (this.connection) {
                const conn = this.connection;
                await conn.close();
                this.logger.log("Conexão fechada com sucesso");
            }
        }
        catch (error) {
            this.logger.error("[RabbitMQ] Erro ao fechar conexão:", error);
        }
    }
};
exports.RabbitMQService = RabbitMQService;
exports.RabbitMQService = RabbitMQService = RabbitMQService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RabbitMQService);
//# sourceMappingURL=rabbitmq.service.js.map