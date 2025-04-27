import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseEntity } from '../../../../core/domain/entities/base.entity';

@Schema()
export class User extends BaseEntity {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  whatsapp: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop()
  activationCode?: string;

  @Prop()
  activationCodeExpiresAt?: Date;

  @Prop()
  loginCode?: string;

  @Prop()
  loginCodeExpiresAt?: Date;

  @Prop()
  lastLoginAt?: Date;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User); 