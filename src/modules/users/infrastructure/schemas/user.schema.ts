import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class UserSchema extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true, default: false })
    isVerified: boolean;
}

export const UserSchemaFactory = SchemaFactory.createForClass(UserSchema); 