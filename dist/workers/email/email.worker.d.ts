import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
export declare class EmailWorker implements OnModuleInit, OnModuleDestroy {
    private connection;
    private channel;
    private readonly transporter;
    constructor();
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private connect;
    private consume;
    private sendEmail;
    private closeConnection;
}
