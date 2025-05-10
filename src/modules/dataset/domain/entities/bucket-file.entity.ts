import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FileStatus = 'available' | 'processing' | 'processed' | 'error';

@Schema({ timestamps: true })
export class BucketFile extends Document {
  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  size: number;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  bucketName: string;

  @Prop({ type: Types.ObjectId })
  knowledgeBaseId?: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['available', 'processing', 'processed', 'error'],
    default: 'available'
  })
  status: FileStatus;

  @Prop()
  processingError?: string;

  @Prop()
  lastModified: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const BucketFileSchema = SchemaFactory.createForClass(BucketFile);
