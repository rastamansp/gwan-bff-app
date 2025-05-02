import { Injectable, Logger } from "@nestjs/common";
import { RabbitMQService } from "./rabbitmq.service";

export interface INotificationService {
  sendEmail(to: string, subject: string, content: string): Promise<void>;
  sendWhatsApp(to: string, message: string): Promise<void>;
}

@Injectable()
export class NotificationService implements INotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async sendEmail(to: string, subject: string, content: string): Promise<void> {
    try {
      this.logger.log(`Preparando envio de email para: ${to}`);
      const emailData = {
        to,
        subject,
        content,
        timestamp: new Date().toISOString(),
      };

      this.logger.log(
        `Enviando mensagem para fila email_notifications: ${JSON.stringify(emailData)}`,
      );
      await this.rabbitMQService.sendToQueue("email_notifications", emailData);
      this.logger.log(
        `Mensagem enviada com sucesso para fila email_notifications`,
      );
    } catch (error) {
      this.logger.error(`Erro ao enviar email para ${to}:`, error);
      throw error;
    }
  }

  async sendWhatsApp(to: string, message: string): Promise<void> {
    try {
      this.logger.log(`Preparando envio de WhatsApp para: ${to}`);
      const whatsappData = {
        to,
        message,
        timestamp: new Date().toISOString(),
      };

      this.logger.log(
        `Enviando mensagem para fila whatsapp_notifications: ${JSON.stringify(whatsappData)}`,
      );
      await this.rabbitMQService.sendToQueue(
        "whatsapp_notifications",
        whatsappData,
      );
      this.logger.log(
        `Mensagem enviada com sucesso para fila whatsapp_notifications`,
      );
    } catch (error) {
      this.logger.error(`Erro ao enviar WhatsApp para ${to}:`, error);
      throw error;
    }
  }
}
