import { ConfigService } from '@nestjs/config';
export declare class RabbitMQService {
    private readonly configService;
    private readonly logger;
    private connection;
    private channel;
    constructor(configService: ConfigService);
    private connect;
    sendToQueue(queue: string, message: any): Promise<void>;
    closeConnection(): Promise<void>;
}
