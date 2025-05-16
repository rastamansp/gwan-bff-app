import { ApiProperty, ApiExtraModels } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNumber, Min, Max } from 'class-validator';
import { CreateChatbotDto, UpdateVectorConfigDto } from '../../domain/dtos/chatbot.dtos';

export class UpdateChatbotDto {
    @ApiProperty({ description: 'Nome do chatbot' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ description: 'Descrição do chatbot' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ description: 'Prompt do sistema para o chatbot' })
    @IsString()
    @IsOptional()
    systemPrompt?: string;

    @ApiProperty({ description: 'Modelo de IA utilizado' })
    @IsString()
    @IsOptional()
    model?: string;

    @ApiProperty({ description: 'Tamanho da janela de contexto' })
    @IsNumber()
    @Min(1)
    @Max(100)
    @IsOptional()
    contentWindowSize?: number;
}

export class UpdateStatusDto {
    @ApiProperty({ description: 'Status de ativação do chatbot' })
    @IsBoolean()
    isActive: boolean;
}

export { CreateChatbotDto, UpdateVectorConfigDto }; 