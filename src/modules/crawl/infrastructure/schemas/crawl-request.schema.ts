import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CrawlRequestDocument = CrawlRequestSchema & Document;

@Schema({ timestamps: true, collection: 'crawl_requests' })
export class CrawlRequestSchema {
    @Prop({ type: Types.ObjectId, required: true })
    userId: Types.ObjectId;

    @Prop({ required: true })
    url: string;

    @Prop({ type: [String], required: true })
    formats: string[];

    @Prop({ type: Object })
    jsonOptions?: {
        schema: {
            type: string;
            properties: Record<string, any>;
            required?: string[];
        };
    };

    @Prop({
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending'
    })
    status: 'pending' | 'processing' | 'completed' | 'failed';

    @Prop({ type: Object })
    result?: any;

    @Prop()
    error?: string;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const CrawlRequestSchemaFactory = SchemaFactory.createForClass(CrawlRequestSchema); 