import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as amqp from "amqplib";
import * as nodemailer from "nodemailer";

interface EmailMessage {
  to: string;
  subject: string;
  content: string;
  timestamp: string;
}

@Injectable()
export class EmailWorker implements OnModuleInit, OnModuleDestroy {
  private connection!: amqp.Connection;
  private channel!: amqp.Channel;
  private readonly transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailWorker.name);
  private readonly maxRetries = 3;
  private readonly retryDelay = 5000; // 5 seconds
  private readonly queueName = "email_notifications";
  private readonly deadLetterExchange = "email_notifications_dlx";
  private readonly deadLetterQueue = "email_notifications_dlq";

  constructor(private readonly configService: ConfigService) {
    // Configuração do transportador SMTP para produção
    this.transporter = nodemailer.createTransport({
      host: this.configService.get("SMTP_HOST"),
      port: this.configService.get("SMTP_PORT"),
      secure: false, // upgrade later with STARTTLS
      requireTLS: true,
      tls: {
        ciphers: "SSLv3",
        rejectUnauthorized: false,
      },
      auth: {
        user: this.configService.get("SMTP_USER"),
        pass: this.configService.get("SMTP_PASSWORD"),
      },
      pool: true, // Usar pool de conexões
      maxConnections: 5, // Limite de conexões simultâneas
      maxMessages: 100, // Limite de mensagens por conexão
      rateDelta: 1000, // Intervalo entre envios (1 segundo)
      rateLimit: 5, // Limite de envios por intervalo
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

  private async connect() {
    let retries = 0;
    while (retries < this.maxRetries) {
      try {
        const rabbitmqUri =
          this.configService.get("RABBITMQ_URI") ||
          "amqp://root:pazdeDeus2025@rabbitmq.gwan.com.br:5672";
        if (!rabbitmqUri) {
          throw new Error("RABBITMQ_URI environment variable is not set");
        }

        const conn = await amqp.connect(rabbitmqUri);
        this.connection = conn as unknown as amqp.Connection;
        const ch = await conn.createChannel();
        this.channel = ch as unknown as amqp.Channel;

        // Configuração do Dead Letter Exchange
        await this.channel.assertExchange(this.deadLetterExchange, "direct", {
          durable: true,
        });
        await this.channel.assertQueue(this.deadLetterQueue, { durable: true });
        await this.channel.bindQueue(
          this.deadLetterQueue,
          this.deadLetterExchange,
          this.queueName,
        );

        // Verifica se a fila existe
        try {
          const queueInfo = await this.channel.checkQueue(this.queueName);
          this.logger.log(
            `[EmailWorker] Fila existente encontrada: ${JSON.stringify(queueInfo)}`,
          );
        } catch (error) {
          this.logger.log(
            "[EmailWorker] Fila não existe, criando nova fila...",
          );
          // Cria a fila apenas se ela não existir
          await this.channel.assertQueue(this.queueName, {
            durable: true,
            arguments: {
              "x-message-ttl": 86400000, // 24 horas em milissegundos
              "x-dead-letter-exchange": this.deadLetterExchange,
              "x-dead-letter-routing-key": this.queueName,
            },
          });
        }

        // Configura o prefetch para processar uma mensagem por vez
        await this.channel.prefetch(1);

        this.logger.log("[EmailWorker] Conectado ao RabbitMQ com sucesso");
        return;
      } catch (error) {
        retries++;
        this.logger.error(
          `[EmailWorker] Erro ao conectar ao RabbitMQ (tentativa ${retries}/${this.maxRetries}):`,
          error,
        );

        if (retries < this.maxRetries) {
          this.logger.log(
            `[EmailWorker] Tentando reconectar em ${this.retryDelay / 1000} segundos...`,
          );
          await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
        } else {
          this.logger.error(
            "[EmailWorker] Número máximo de tentativas de conexão atingido",
          );
          throw error;
        }
      }
    }
  }

  private async consume() {
    try {
      if (!this.channel) {
        await this.connect();
      }

      await this.channel.consume(this.queueName, async (msg) => {
        if (msg) {
          try {
            const emailData: EmailMessage = JSON.parse(msg.content.toString());
            await this.sendEmail(emailData);

            // Confirma o processamento da mensagem
            this.channel.ack(msg);
          } catch (error) {
            this.logger.error(
              "[EmailWorker] Erro ao processar mensagem:",
              error,
            );

            // Rejeita a mensagem e devolve para a fila
            this.channel.nack(msg, false, true);
          }
        }
      });

      this.logger.log("[EmailWorker] Consumidor iniciado com sucesso");
    } catch (error) {
      this.logger.error("[EmailWorker] Erro ao iniciar consumidor:", error);
      // Tenta reiniciar o consumidor após o delay
      setTimeout(() => this.consume(), this.retryDelay);
    }
  }

  private async sendEmail(emailData: EmailMessage) {
    let retries = 0;
    while (retries < this.maxRetries) {
      try {
        const mailOptions = {
          from: {
            name: this.configService.get("SMTP_FROM_NAME", "GWAN"),
            address: this.configService.get(
              "SMTP_FROM_EMAIL",
              "gwan@gwan.com.br",
            ),
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
        this.logger.log(
          `[EmailWorker] Email enviado com sucesso - Assunto [${emailData.subject}] para [${emailData.to}] conteudo[${emailData.content}] date[${new Date().toISOString()}]`,
        );
        return;
      } catch (error) {
        retries++;
        this.logger.error(
          `[EmailWorker] Erro ao enviar email (tentativa ${retries}/${this.maxRetries}):`,
          error,
        );

        if (retries < this.maxRetries) {
          this.logger.log(
            `[EmailWorker] Tentando reenviar em ${this.retryDelay / 1000} segundos...`,
          );
          await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
        } else {
          this.logger.error(
            "[EmailWorker] Número máximo de tentativas de envio atingido",
          );
          throw error;
        }
      }
    }
  }

  private async closeConnection() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        const conn = this.connection as unknown as {
          close: () => Promise<void>;
        };
        await conn.close();
      }
      this.logger.log("[EmailWorker] Conexões fechadas com sucesso");
    } catch (error) {
      this.logger.error("[EmailWorker] Erro ao fechar conexões:", error);
    }
  }
}
