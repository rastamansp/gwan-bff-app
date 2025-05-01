import { Injectable } from '@nestjs/common';
const amqp = require('amqplib') as any;

@Injectable()
export class RabbitMQService {
    private connection: any;
    private channel: any;
    private readonly queueName = 'knowledge_base_processing';

    async init() {
        try {
            this.connection = await amqp.connect(process.env.RABBITMQ_URL);
            this.channel = await this.connection.createChannel();
            await this.channel.assertQueue(this.queueName, {
                durable: true // A fila persistirá mesmo após o reinício do RabbitMQ
            });
            console.log('RabbitMQ conectado com sucesso');
        } catch (error) {
            console.error('Erro ao conectar com RabbitMQ:', error);
            throw error;
        }
    }

    async sendMessage(message: any) {
        try {
            await this.channel.sendToQueue(this.queueName, Buffer.from(JSON.stringify(message)), {
                persistent: true // A mensagem persistirá mesmo após o reinício do RabbitMQ
            });
            console.log('Mensagem enviada com sucesso:', message);
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            throw error;
        }
    }

    async closeConnection() {
        try {
            if (this.channel) {
                await this.channel.close();
            }
            if (this.connection) {
                await this.connection.close();
            }
            console.log('Conexão com RabbitMQ fechada com sucesso');
        } catch (error) {
            console.error('Erro ao fechar conexão com RabbitMQ:', error);
            throw error;
        }
    }
} 