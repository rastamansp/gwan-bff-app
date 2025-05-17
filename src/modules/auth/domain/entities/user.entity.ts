import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { BaseEntity } from "../../../../core/domain/base.entity";
import { IsEmail, IsString, IsOptional, IsBoolean, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class User extends BaseEntity {
  @ApiProperty({ description: 'Nome do usuário' })
  @Prop({ required: true })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Email do usuário' })
  @Prop({ required: true, unique: true })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'WhatsApp do usuário' })
  @Prop({ required: true, unique: true })
  @IsString()
  whatsapp: string;

  @ApiProperty({ description: 'Status de verificação do email' })
  @Prop({ default: false })
  @IsBoolean()
  isEmailVerified: boolean;

  @ApiProperty({ description: 'Status de ativação da conta' })
  @Prop({ default: true })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ description: 'Status de verificação' })
  @Prop({ default: false })
  @IsBoolean()
  isVerified: boolean;

  @ApiProperty({ description: 'Código de ativação' })
  @Prop()
  @IsString()
  @IsOptional()
  activationCode?: string;

  @ApiProperty({ description: 'Data de expiração do código de ativação' })
  @Prop()
  @IsDate()
  @IsOptional()
  activationCodeExpiresAt?: Date;

  @ApiProperty({ description: 'Código de login' })
  @Prop()
  @IsString()
  @IsOptional()
  loginCode?: string;

  @ApiProperty({ description: 'Data de expiração do código de login' })
  @Prop()
  @IsDate()
  @IsOptional()
  loginCodeExpiresAt?: Date;

  @ApiProperty({ description: 'Data do último login' })
  @Prop()
  @IsDate()
  @IsOptional()
  lastLoginAt?: Date;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
