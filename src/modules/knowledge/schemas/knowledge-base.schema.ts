import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class KnowledgeBase extends Document {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    fileId: string;

    @Prop({ required: true })
    name: string;

    @Prop()
    description: string;

    @Prop({ default: 'processing' })
    status: 'processing' | 'completed' | 'failed';

    @Prop()
    error?: string;

    @Prop({ type: Object })
    metadata?: {
        totalChunks?: number;
        processedChunks?: number;
        totalTokens?: number;
    };
}

export const KnowledgeBaseSchema = SchemaFactory.createForClass(KnowledgeBase); 