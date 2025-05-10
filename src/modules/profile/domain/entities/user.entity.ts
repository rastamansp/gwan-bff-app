import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { BaseEntity } from "../../../../core/domain/entities/base.entity";
import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class User extends BaseEntity {
    @ApiProperty({
        description: 'Nome do usuário',
        example: 'John Doe',
        minLength: 3,
        maxLength: 100
    })
    @Prop({ required: true })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Descrição do usuário',
        example: 'Desenvolvedor Full Stack',
        required: false,
        maxLength: 500
    })
    @Prop()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'Email do usuário',
        example: 'john@example.com',
        format: 'email'
    })
    @Prop({ required: true, unique: true })
    @IsString()
    email: string;

    @ApiProperty({
        description: 'WhatsApp do usuário',
        example: '5511999999999'
    })
    @Prop({ required: true, unique: true })
    @IsString()
    whatsapp: string;

    @ApiProperty({
        description: 'Status de verificação do email',
        example: false,
        default: false
    })
    @Prop({ default: false })
    @IsBoolean()
    isEmailVerified: boolean;

    @ApiProperty({
        description: 'Status de ativação da conta',
        example: true,
        default: true
    })
    @Prop({ default: true })
    @IsBoolean()
    isActive: boolean;

    @ApiProperty({
        description: 'Status de verificação',
        example: false,
        default: false
    })
    @Prop({ default: false })
    @IsBoolean()
    isVerified: boolean;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User); 