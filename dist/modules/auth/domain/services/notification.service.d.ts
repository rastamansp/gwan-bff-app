import { RabbitMQService } from './rabbitmq.service';
export interface INotificationService {
    sendEmail(to: string, subject: string, content: string): Promise<void>;
    sendWhatsApp(to: string, message: string): Promise<void>;
}
export declare class NotificationService implements INotificationService {
    private readonly rabbitMQService;
    private readonly logger;
    constructor(rabbitMQService: RabbitMQService);
    sendEmail(to: string, subject: string, content: string): Promise<void>;
    sendWhatsApp(to: string, message: string): Promise<void>;
}
