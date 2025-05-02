import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class BucketFile extends Document {
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

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  bucketName: string;
}

export const BucketFileSchema = SchemaFactory.createForClass(BucketFile);
