import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BaseEntity } from '../../../../core/domain/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class Chatbot extends BaseEntity {
    @ApiProperty({ description: 'ID do usuário que criou o chatbot' })
    @Prop({ required: true, type: Types.ObjectId })
    userId: Types.ObjectId;

    @ApiProperty({ description: 'Nome do chatbot' })
    @Prop({ required: true })
    name: string;

    @ApiProperty({ description: 'Descrição do chatbot' })
    @Prop({ required: true })
    description: string;

    @ApiProperty({ description: 'Prompt do sistema para o chatbot' })
    @Prop({ required: true })
    systemPrompt: string;

    @ApiProperty({ description: 'Modelo de IA utilizado' })
    @Prop({ required: true })
    aiModel: string;

    @ApiProperty({ description: 'Máximo de tokens para respostas da IA', default: 2000 })
    @Prop({ default: 2000 })
    maxTokens: number;

    @ApiProperty({ description: 'Tamanho da janela de contexto' })
    @Prop({ required: true, default: 12 })
    contentWindowSize: number;

    @ApiProperty({ description: 'ID do chatbot no n8n' })
    @Prop()
    n8nId?: string;

    @ApiProperty({ description: 'ID do workflow no n8n' })
    @Prop()
    n8nWorkflowId?: string;

    @ApiProperty({ description: 'URL do webhook do chat no n8n' })
    @Prop()
    n8nChatUrl?: string;

    @ApiProperty({ description: 'Se o chat requer clique no botão para iniciar' })
    @Prop({ default: true })
    n8nChatRequireButtonClicktoStart?: boolean;

    @ApiProperty({ description: 'Título do chat' })
    @Prop()
    n8nChatTitle?: string;

    @ApiProperty({ description: 'Subtítulo do chat' })
    @Prop()
    n8nChatSubtitle?: string;

    @ApiProperty({ description: 'Mensagem inicial do chat' })
    @Prop()
    n8nChatInitialMessage?: string;

    @ApiProperty({ description: 'Nome do vetor de dados' })
    @Prop()
    dataVector?: string;

    @ApiProperty({ description: 'Tamanho do vetor de dados' })
    @Prop()
    dataVectorSize?: number;

    @ApiProperty({ description: 'Índice do vetor de dados' })
    @Prop()
    dataVectorIndex?: string;

    @ApiProperty({ description: 'Namespace do vetor de dados' })
    @Prop()
    dataVectorNamespace?: string;

    @ApiProperty({ description: 'Modelo do vetor de dados' })
    @Prop()
    dataVectorModel?: string;

    @ApiProperty({ description: 'Modelo de embeddings do vetor de dados' })
    @Prop()
    dataVectorEmbeddingsModel?: string;

    @ApiProperty({ description: 'Status de ativação do chatbot' })
    @Prop({ default: true })
    isActive: boolean;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    constructor(partial: Partial<Chatbot>) {
        super();
        Object.assign(this, partial);
    }

    activate(): void {
        this.isActive = true;
        this.updatedAt = new Date();
    }

    deactivate(): void {
        this.isActive = false;
        this.updatedAt = new Date();
    }

    updateDetails(details: Partial<Chatbot>): void {
        Object.assign(this, details);
        this.updatedAt = new Date();
    }
}

export type ChatbotDocument = Chatbot & Document;
export const ChatbotSchema = SchemaFactory.createForClass(Chatbot); 