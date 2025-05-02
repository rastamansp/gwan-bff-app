import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as amqp from "amqp-connection-manager";
import { ChannelWrapper } from "amqp-connection-manager";
import { Channel, ConsumeMessage } from "amqplib";

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQService.name);
  private connection: amqp.AmqpConnectionManager;
  private channelWrapper: ChannelWrapper;

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>("RABBITMQ_URL");
    if (!url) {
      throw new Error("RABBITMQ_URL not configured");
    }

    this.connection = amqp.connect([url]);
    this.connection.on("connect", () => {
      this.logger.log("Conectado ao RabbitMQ");
    });
    this.connection.on("disconnect", (err) => {
      this.logger.error("Desconectado do RabbitMQ", err);
    });

    this.channelWrapper = this.connection.createChannel({
      setup: (channel: Channel) => {
        return Promise.all([
          channel.assertExchange("knowledge.exchange", "topic", {
            durable: true,
          }),
        ]);
      },
    });
  }

  async onModuleInit() {
    try {
      await this.channelWrapper.waitForConnect();
      this.logger.log("Canal RabbitMQ inicializado com sucesso");
    } catch (error) {
      this.logger.error("Erro ao inicializar canal RabbitMQ:", error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.channelWrapper.close();
      await this.connection.close();
      this.logger.log("Conexão com RabbitMQ fechada com sucesso");
    } catch (error) {
      this.logger.error("Erro ao fechar conexão com RabbitMQ:", error);
    }
  }

  async sendMessage(message: any): Promise<void> {
    try {
      const exchange = "knowledge.exchange";
      const routingKey = "knowledge.process";

      await this.channelWrapper.publish(
        exchange,
        routingKey,
        Buffer.from(JSON.stringify(message)),
        {
          persistent: true,
        },
      );

      this.logger.debug(
        `Mensagem publicada com sucesso: ${routingKey}`,
        message,
      );
    } catch (error) {
      this.logger.error("Erro ao publicar mensagem no RabbitMQ:", error);
      throw error;
    }
  }

  async publish(routingKey: string, message: any): Promise<void> {
    try {
      const exchange = "knowledge.exchange";

      await this.channelWrapper.publish(
        exchange,
        routingKey,
        Buffer.from(JSON.stringify(message)),
        {
          persistent: true,
        },
      );

      this.logger.debug(
        `Mensagem publicada com sucesso: ${routingKey}`,
        message,
      );
    } catch (error) {
      this.logger.error("Erro ao publicar mensagem no RabbitMQ:", error);
      throw error;
    }
  }

  async consume(
    queue: string,
    callback: (message: any) => Promise<void>,
  ): Promise<void> {
    try {
      await this.channelWrapper.addSetup(async (channel: Channel) => {
        await channel.assertQueue(queue, { durable: true });
        await channel.consume(queue, async (msg: ConsumeMessage | null) => {
          if (msg) {
            try {
              const content = JSON.parse(msg.content.toString());
              await callback(content);
              channel.ack(msg);
            } catch (error) {
              this.logger.error("Erro ao processar mensagem:", error);
              channel.nack(msg, false, true);
            }
          }
        });
      });

      this.logger.log(`Consumidor iniciado para a fila: ${queue}`);
    } catch (error) {
      this.logger.error("Erro ao iniciar consumidor:", error);
      throw error;
    }
  }
}
