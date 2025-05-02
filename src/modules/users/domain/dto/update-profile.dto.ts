import { IsString, IsOptional, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
    @ApiProperty({
        description: 'Nome do usuário',
        example: 'João da Silva',
        minLength: 3,
        maxLength: 100
    })
    @IsString()
    @MinLength(3, { message: 'O nome deve ter no mínimo 3 caracteres' })
    @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
    name: string;

    @ApiProperty({
        description: 'Número do WhatsApp do usuário',
        example: '+5511999999999',
        required: false,
        pattern: '\\+?[1-9]\\d{1,14}$'
    })
    @IsString()
    @IsOptional()
    @Matches(/\+?[1-9]\d{1,14}$/, {
        message: 'Formato de WhatsApp inválido. Use o formato internacional (ex: +5511999999999)'
    })
    whatsapp?: string;
} 