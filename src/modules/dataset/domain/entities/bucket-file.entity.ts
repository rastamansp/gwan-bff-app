import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseEntity } from '../../../../core/domain/entities/base.entity';

@Schema()
export class BucketFile extends BaseEntity {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    originalName: string;

    @Prop({ required: true })
    fileName: string;

    @Prop({ required: true })
    size: number;

    @Prop({ required: true })
    mimeType: string;

    @Prop()
    url?: string;

    @Prop({ required: true })
    bucketName: string;
}

export type BucketFileDocument = BucketFile & Document;
export const BucketFileSchema = SchemaFactory.createForClass(BucketFile); 