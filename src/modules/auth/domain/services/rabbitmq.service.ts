import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService {
  private connection!: amqp.Connection;
  private channel!: amqp.Channel;

  constructor() {
    this.connect();
  }

  private async connect() {
    try {
      // Conecta ao RabbitMQ usando as credenciais do docker-compose
      const conn = await amqp.connect('amqp://root:pazdeDeus2025@rabbitmq.gwan.com.br');
      this.connection = conn as unknown as amqp.Connection;
      const ch = await conn.createChannel();
      this.channel = ch as unknown as amqp.Channel;

      // Declara as filas que serão utilizadas
      await this.channel.assertQueue('email_notifications', { durable: true });
      await this.channel.assertQueue('whatsapp_notifications', { durable: true });

      console.log('[RabbitMQ] Conectado com sucesso');
    } catch (error) {
      console.error('[RabbitMQ] Erro ao conectar:', error);
      // Tenta reconectar após 5 segundos em caso de erro
      setTimeout(() => this.connect(), 5000);
    }
  }

  async sendToQueue(queue: string, message: any): Promise<void> {
    try {
      if (!this.channel) {
        await this.connect();
      }

      const messageBuffer = Buffer.from(JSON.stringify(message));
      await this.channel.sendToQueue(queue, messageBuffer, {
        persistent: true
      });

      console.log(`[RabbitMQ] Mensagem enviada para a fila ${queue}`);
    } catch (error) {
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
        const conn = this.connection as unknown as { close: () => Promise<void> };
        await conn.close();
      }
    } catch (error) {
      console.error('[RabbitMQ] Erro ao fechar conexão:', error);
    }
  }
} 