import { Injectable } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';

export interface INotificationService {
  sendEmail(to: string, subject: string, content: string): Promise<void>;
  sendWhatsApp(to: string, message: string): Promise<void>;
}

@Injectable()
export class NotificationService implements INotificationService {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async sendEmail(to: string, subject: string, content: string): Promise<void> {
    try {
      const emailData = {
        to,
        subject,
        content,
        timestamp: new Date().toISOString()
      };

      await this.rabbitMQService.sendToQueue('email_notifications', emailData);
      console.log(`[Email] Mensagem enfileirada para: ${to}`);
    } catch (error) {
      console.error('[Email] Erro ao enfileirar mensagem:', error);
      throw error;
    }
  }

  async sendWhatsApp(to: string, message: string): Promise<void> {
    try {
      const whatsappData = {
        to,
        message,
        timestamp: new Date().toISOString()
      };

      await this.rabbitMQService.sendToQueue('whatsapp_notifications', whatsappData);
      console.log(`[WhatsApp] Mensagem enfileirada para: ${to}`);
    } catch (error) {
      console.error('[WhatsApp] Erro ao enfileirar mensagem:', error);
      throw error;
    }
  }
} 