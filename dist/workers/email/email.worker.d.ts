import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class EmailWorker implements OnModuleInit, OnModuleDestroy {
    private readonly configService;
    private connection;
    private channel;
    private readonly transporter;
    private readonly logger;
    private readonly maxRetries;
    private readonly retryDelay;
    private readonly queueName;
    private readonly deadLetterExchange;
    private readonly deadLetterQueue;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private connect;
    private consume;
    private sendEmail;
    private closeConnection;
}
