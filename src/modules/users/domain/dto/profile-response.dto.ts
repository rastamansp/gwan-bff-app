import { ApiProperty } from '@nestjs/swagger';

export class ProfileResponseDto {
    @ApiProperty({ description: 'ID do usuário' })
    id: string;

    @ApiProperty({ description: 'Nome do usuário' })
    name: string;

    @ApiProperty({ description: 'Email do usuário' })
    email: string;

    @ApiProperty({ description: 'Número do WhatsApp do usuário', required: false, nullable: true })
    whatsapp?: string;

    @ApiProperty({ description: 'Data de criação do usuário' })
    createdAt: Date;

    @ApiProperty({ description: 'Data da última atualização do usuário' })
    updatedAt: Date;
} 