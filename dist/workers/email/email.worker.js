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
exports.EmailWorker = void 0;
const common_1 = require("@nestjs/common");
const amqp = require("amqplib");
const nodemailer = require("nodemailer");
let EmailWorker = class EmailWorker {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER || 'seu-email@gmail.com',
                pass: process.env.SMTP_PASSWORD || 'sua-senha-app',
            },
        });
    }
    async onModuleInit() {
        await this.connect();
        await this.consume();
    }
    async onModuleDestroy() {
        await this.closeConnection();
    }
    async connect() {
        try {
            const rabbitmqUri = process.env.RABBITMQ_URI || 'amqp://root:pazdeDeus2025@rabbitmq.gwan.com.br';
            const conn = await amqp.connect(rabbitmqUri);
            this.connection = conn;
            const ch = await conn.createChannel();
            this.channel = ch;
            await this.channel.assertQueue('email_notifications', { durable: true });
            await this.channel.prefetch(1);
            console.log('[EmailWorker] Conectado ao RabbitMQ');
        }
        catch (error) {
            console.error('[EmailWorker] Erro ao conectar ao RabbitMQ:', error);
            setTimeout(() => this.connect(), 5000);
        }
    }
    async consume() {
        try {
            if (!this.channel) {
                await this.connect();
            }
            await this.channel.consume('email_notifications', async (msg) => {
                if (msg) {
                    try {
                        const emailData = JSON.parse(msg.content.toString());
                        await this.sendEmail(emailData);
                        this.channel.ack(msg);
                    }
                    catch (error) {
                        console.error('[EmailWorker] Erro ao processar mensagem:', error);
                        this.channel.nack(msg, false, true);
                    }
                }
            });
            console.log('[EmailWorker] Consumidor iniciado');
        }
        catch (error) {
            console.error('[EmailWorker] Erro ao iniciar consumidor:', error);
            setTimeout(() => this.consume(), 5000);
        }
    }
    async sendEmail(emailData) {
        try {
            const mailOptions = {
                from: {
                    name: process.env.SMTP_FROM_NAME || 'GWAN',
                    address: process.env.SMTP_FROM_EMAIL || 'noreply@gwan.com.br'
                },
                to: emailData.to,
                subject: emailData.subject,
                text: emailData.content,
                html: emailData.content.replace(/\n/g, '<br>'),
            };
            await this.transporter.sendMail(mailOptions);
            console.log(`[EmailWorker] Email enviado com sucesso para ${emailData.to}`);
        }
        catch (error) {
            console.error('[EmailWorker] Erro ao enviar email:', error);
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
            console.error('[EmailWorker] Erro ao fechar conexão:', error);
        }
    }
};
exports.EmailWorker = EmailWorker;
exports.EmailWorker = EmailWorker = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailWorker);
//# sourceMappingURL=email.worker.js.map