import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseEntity } from '../../../../core/domain/entities/base.entity';

@Schema({ timestamps: true })
export class Knowledge extends BaseEntity {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    content: string;

    @Prop({ required: true })
    category: string;

    @Prop({ type: [String], default: [] })
    tags: string[];

    @Prop({ required: true })
    authorId: string;
}

export type KnowledgeDocument = Knowledge & Document;
export const KnowledgeSchema = SchemaFactory.createForClass(Knowledge); 