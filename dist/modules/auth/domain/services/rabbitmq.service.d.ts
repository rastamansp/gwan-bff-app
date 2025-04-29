export declare class RabbitMQService {
    private readonly logger;
    private connection;
    private channel;
    constructor();
    private connect;
    sendToQueue(queue: string, message: any): Promise<void>;
    closeConnection(): Promise<void>;
}
