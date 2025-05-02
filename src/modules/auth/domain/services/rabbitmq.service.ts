import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as amqp from "amqplib";

@Injectable()
export class RabbitMQService {
  private readonly logger = new Logger(RabbitMQService.name);
  private connection!: amqp.Connection;
  private channel!: amqp.Channel;

  constructor(private readonly configService: ConfigService) {
    this.connect();
  }

  private async connect() {
    try {
      this.logger.log("Iniciando conexão com RabbitMQ...");

      const rabbitmqUri = this.configService.get<string>("RABBITMQ_URL");
      if (!rabbitmqUri) {
        throw new Error(
          "RABBITMQ_URI não está definida nas variáveis de ambiente",
        );
      }

      const conn = await amqp.connect(rabbitmqUri);
      this.connection = conn as unknown as amqp.Connection;
      const ch = await conn.createChannel();
      this.channel = ch as unknown as amqp.Channel;

      // Declara as filas que serão utilizadas
      this.logger.log("Declarando filas...");
      await this.channel.assertQueue("email_notifications", {
        durable: true,
        arguments: {
          "x-message-ttl": 86400000, // 24 horas em milissegundos
          "x-dead-letter-exchange": "email_notifications_dlx",
          "x-dead-letter-routing-key": "email_notifications",
        },
      });
      await this.channel.assertQueue("whatsapp_notifications", {
        durable: true,
      });
      this.logger.log("Filas declaradas com sucesso");

      this.logger.log("[RabbitMQ] Conectado com sucesso");
    } catch (error) {
      this.logger.error("[RabbitMQ] Erro ao conectar:", error);
      this.logger.log("[RabbitMQ] Tentando reconectar em 5 segundos...");
      setTimeout(() => this.connect(), 5000);
    }
  }

  async sendToQueue(queue: string, message: any): Promise<void> {
    try {
      this.logger.log(
        `Verificando conexão com RabbitMQ para envio à fila ${queue}...`,
      );
      if (!this.channel) {
        this.logger.log("Canal não encontrado, tentando reconectar...");
        await this.connect();
      }

      const messageBuffer = Buffer.from(JSON.stringify(message));
      this.logger.debug(
        `Enviando mensagem para fila ${queue}: ${messageBuffer.toString()}`,
      );

      await this.channel.sendToQueue(queue, messageBuffer, {
        persistent: true,
      });

      this.logger.log(
        `[RabbitMQ] Mensagem enviada com sucesso para a fila ${queue}`,
      );
    } catch (error) {
      this.logger.error(
        `[RabbitMQ] Erro ao enviar mensagem para a fila ${queue}:`,
        error,
      );
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
        const conn = this.connection as unknown as {
          close: () => Promise<void>;
        };
        await conn.close();
        this.logger.log("Conexão fechada com sucesso");
      }
    } catch (error) {
      this.logger.error("[RabbitMQ] Erro ao fechar conexão:", error);
    }
  }
}
