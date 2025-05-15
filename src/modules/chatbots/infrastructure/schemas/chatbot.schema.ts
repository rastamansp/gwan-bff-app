import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ChatbotSchema extends Document {
    @Prop({ required: true, type: Types.ObjectId })
    userId: Types.ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    systemPrompt: string;

    @Prop({ required: true })
    aiModel: string;

    @Prop({ default: 2000 })
    maxTokens: number;

    @Prop({ required: true, default: 12 })
    contentWindowSize: number;

    @Prop()
    n8nId?: string;

    @Prop()
    n8nWorkflowId?: string;

    @Prop()
    n8nChatUrl?: string;

    @Prop({ default: true })
    n8nChatRequireButtonClicktoStart?: boolean;

    @Prop()
    n8nChatTitle?: string;

    @Prop()
    n8nChatSubtitle?: string;

    @Prop()
    n8nChatInitialMessage?: string;

    @Prop()
    dataVector?: string;

    @Prop()
    dataVectorSize?: number;

    @Prop()
    dataVectorIndex?: string;

    @Prop()
    dataVectorNamespace?: string;

    @Prop()
    dataVectorModel?: string;

    @Prop()
    dataVectorEmbeddingsModel?: string;

    @Prop({ default: true })
    isActive: boolean;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const ChatbotSchemaFactory = SchemaFactory.createForClass(ChatbotSchema); 