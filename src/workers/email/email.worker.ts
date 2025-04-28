import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';
import * as nodemailer from 'nodemailer';

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

  constructor() {
    // Configuração do transportador SMTP
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

  private async connect() {
    try {
      const rabbitmqUri = process.env.RABBITMQ_URI || 'amqp://root:pazdeDeus2025@rabbitmq.gwan.com.br';
      const conn = await amqp.connect(rabbitmqUri);
      this.connection = conn as unknown as amqp.Connection;
      const ch = await conn.createChannel();
      this.channel = ch as unknown as amqp.Channel;
      
      // Garante que a fila existe
      await this.channel.assertQueue('email_notifications', { durable: true });
      
      // Configura o prefetch para processar uma mensagem por vez
      await this.channel.prefetch(1);
      
      console.log('[EmailWorker] Conectado ao RabbitMQ');
    } catch (error) {
      console.error('[EmailWorker] Erro ao conectar ao RabbitMQ:', error);
      // Tenta reconectar após 5 segundos
      setTimeout(() => this.connect(), 5000);
    }
  }

  private async consume() {
    try {
      if (!this.channel) {
        await this.connect();
      }

      await this.channel.consume('email_notifications', async (msg) => {
        if (msg) {
          try {
            const emailData: EmailMessage = JSON.parse(msg.content.toString());
            await this.sendEmail(emailData);
            
            // Confirma o processamento da mensagem
            this.channel.ack(msg);
          } catch (error) {
            console.error('[EmailWorker] Erro ao processar mensagem:', error);
            
            // Rejeita a mensagem e devolve para a fila
            this.channel.nack(msg, false, true);
          }
        }
      });

      console.log('[EmailWorker] Consumidor iniciado');
    } catch (error) {
      console.error('[EmailWorker] Erro ao iniciar consumidor:', error);
      // Tenta reiniciar o consumidor após 5 segundos
      setTimeout(() => this.consume(), 5000);
    }
  }

  private async sendEmail(emailData: EmailMessage) {
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
    } catch (error) {
      console.error('[EmailWorker] Erro ao enviar email:', error);
      throw error;
    }
  }

  private async closeConnection() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        const conn = this.connection as unknown as { close: () => Promise<void> };
        await conn.close();
      }
    } catch (error) {
      console.error('[EmailWorker] Erro ao fechar conexão:', error);
    }
  }
} 