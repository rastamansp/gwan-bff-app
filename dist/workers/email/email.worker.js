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
var EmailWorker_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailWorker = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const amqp = require("amqplib");
const nodemailer = require("nodemailer");
let EmailWorker = EmailWorker_1 = class EmailWorker {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(EmailWorker_1.name);
        this.maxRetries = 3;
        this.retryDelay = 5000;
        this.queueName = "email_notifications";
        this.deadLetterExchange = "email_notifications_dlx";
        this.deadLetterQueue = "email_notifications_dlq";
        this.transporter = nodemailer.createTransport({
            host: this.configService.get("SMTP_HOST"),
            port: this.configService.get("SMTP_PORT"),
            secure: false,
            requireTLS: true,
            tls: {
                ciphers: "SSLv3",
                rejectUnauthorized: false,
            },
            auth: {
                user: this.configService.get("SMTP_USER"),
                pass: this.configService.get("SMTP_PASSWORD"),
            },
            pool: true,
            maxConnections: 5,
            maxMessages: 100,
            rateDelta: 1000,
            rateLimit: 5,
        });
        this.logger.log("Email worker initialized with production settings");
    }
    async onModuleInit() {
        await this.connect();
        await this.consume();
    }
    async onModuleDestroy() {
        await this.closeConnection();
    }
    async connect() {
        let retries = 0;
        while (retries < this.maxRetries) {
            try {
                const rabbitmqUri = this.configService.get("RABBITMQ_URI") ||
                    "amqp://root:pazdeDeus2025@rabbitmq.gwan.com.br:5672";
                if (!rabbitmqUri) {
                    throw new Error("RABBITMQ_URI environment variable is not set");
                }
                const conn = await amqp.connect(rabbitmqUri);
                this.connection = conn;
                const ch = await conn.createChannel();
                this.channel = ch;
                await this.channel.assertExchange(this.deadLetterExchange, "direct", {
                    durable: true,
                });
                await this.channel.assertQueue(this.deadLetterQueue, { durable: true });
                await this.channel.bindQueue(this.deadLetterQueue, this.deadLetterExchange, this.queueName);
                try {
                    const queueInfo = await this.channel.checkQueue(this.queueName);
                    this.logger.log(`[EmailWorker] Fila existente encontrada: ${JSON.stringify(queueInfo)}`);
                }
                catch (error) {
                    this.logger.log("[EmailWorker] Fila não existe, criando nova fila...");
                    await this.channel.assertQueue(this.queueName, {
                        durable: true,
                        arguments: {
                            "x-message-ttl": 86400000,
                            "x-dead-letter-exchange": this.deadLetterExchange,
                            "x-dead-letter-routing-key": this.queueName,
                        },
                    });
                }
                await this.channel.prefetch(1);
                this.logger.log("[EmailWorker] Conectado ao RabbitMQ com sucesso");
                return;
            }
            catch (error) {
                retries++;
                this.logger.error(`[EmailWorker] Erro ao conectar ao RabbitMQ (tentativa ${retries}/${this.maxRetries}):`, error);
                if (retries < this.maxRetries) {
                    this.logger.log(`[EmailWorker] Tentando reconectar em ${this.retryDelay / 1000} segundos...`);
                    await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
                }
                else {
                    this.logger.error("[EmailWorker] Número máximo de tentativas de conexão atingido");
                    throw error;
                }
            }
        }
    }
    async consume() {
        try {
            if (!this.channel) {
                await this.connect();
            }
            await this.channel.consume(this.queueName, async (msg) => {
                if (msg) {
                    try {
                        const emailData = JSON.parse(msg.content.toString());
                        await this.sendEmail(emailData);
                        this.channel.ack(msg);
                    }
                    catch (error) {
                        this.logger.error("[EmailWorker] Erro ao processar mensagem:", error);
                        this.channel.nack(msg, false, true);
                    }
                }
            });
            this.logger.log("[EmailWorker] Consumidor iniciado com sucesso");
        }
        catch (error) {
            this.logger.error("[EmailWorker] Erro ao iniciar consumidor:", error);
            setTimeout(() => this.consume(), this.retryDelay);
        }
    }
    async sendEmail(emailData) {
        let retries = 0;
        while (retries < this.maxRetries) {
            try {
                const mailOptions = {
                    from: {
                        name: this.configService.get("SMTP_FROM_NAME", "GWAN"),
                        address: this.configService.get("SMTP_FROM_EMAIL", "gwan@gwan.com.br"),
                    },
                    to: emailData.to,
                    subject: emailData.subject,
                    text: emailData.content,
                    html: emailData.content.replace(/\n/g, "<br>"),
                    headers: {
                        "X-Priority": "1",
                        "X-MSMail-Priority": "High",
                        Importance: "high",
                    },
                };
                await this.transporter.sendMail(mailOptions);
                this.logger.log(`[EmailWorker] Email enviado com sucesso - Assunto [${emailData.subject}] para [${emailData.to}] conteudo[${emailData.content}] date[${new Date().toISOString()}]`);
                return;
            }
            catch (error) {
                retries++;
                this.logger.error(`[EmailWorker] Erro ao enviar email (tentativa ${retries}/${this.maxRetries}):`, error);
                if (retries < this.maxRetries) {
                    this.logger.log(`[EmailWorker] Tentando reenviar em ${this.retryDelay / 1000} segundos...`);
                    await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
                }
                else {
                    this.logger.error("[EmailWorker] Número máximo de tentativas de envio atingido");
                    throw error;
                }
            }
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
            this.logger.log("[EmailWorker] Conexões fechadas com sucesso");
        }
        catch (error) {
            this.logger.error("[EmailWorker] Erro ao fechar conexões:", error);
        }
    }
};
exports.EmailWorker = EmailWorker;
exports.EmailWorker = EmailWorker = EmailWorker_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailWorker);
//# sourceMappingURL=email.worker.js.map