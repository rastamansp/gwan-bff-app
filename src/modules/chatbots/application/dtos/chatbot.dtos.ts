import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNumber, Min, Max } from 'class-validator';

export class CreateChatbotDto {
    @ApiProperty({ description: 'Nome do chatbot' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'Descrição do chatbot' })
    @IsString()
    description: string;

    @ApiProperty({ description: 'Prompt do sistema para o chatbot' })
    @IsString()
    systemPrompt: string;

    @ApiProperty({ description: 'Modelo de IA utilizado' })
    @IsString()
    model: string;

    @ApiProperty({ description: 'Tamanho da janela de contexto', default: 12 })
    @IsNumber()
    @Min(1)
    @Max(100)
    @IsOptional()
    contentWindowSize?: number;
}

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

export class UpdateN8nConfigDto {
    @ApiProperty({ description: 'ID do chatbot no n8n' })
    @IsString()
    @IsOptional()
    n8nId?: string;

    @ApiProperty({ description: 'ID do workflow no n8n' })
    @IsString()
    @IsOptional()
    n8nWorkflowId?: string;

    @ApiProperty({ description: 'URL do webhook do chat no n8n' })
    @IsString()
    @IsOptional()
    n8nChatUrl?: string;

    @ApiProperty({ description: 'Se o chat requer clique no botão para iniciar' })
    @IsBoolean()
    @IsOptional()
    n8nChatRequireButtonClicktoStart?: boolean;

    @ApiProperty({ description: 'Título do chat' })
    @IsString()
    @IsOptional()
    n8nChatTitle?: string;

    @ApiProperty({ description: 'Subtítulo do chat' })
    @IsString()
    @IsOptional()
    n8nChatSubtitle?: string;

    @ApiProperty({ description: 'Mensagem inicial do chat' })
    @IsString()
    @IsOptional()
    n8nChatInitialMessage?: string;
}

export class UpdateVectorConfigDto {
    @ApiProperty({ description: 'Nome do vetor de dados' })
    @IsString()
    @IsOptional()
    dataVector?: string;

    @ApiProperty({ description: 'Tamanho do vetor de dados' })
    @IsNumber()
    @IsOptional()
    dataVectorSize?: number;

    @ApiProperty({ description: 'Índice do vetor de dados' })
    @IsString()
    @IsOptional()
    dataVectorIndex?: string;

    @ApiProperty({ description: 'Namespace do vetor de dados' })
    @IsString()
    @IsOptional()
    dataVectorNamespace?: string;

    @ApiProperty({ description: 'Modelo do vetor de dados' })
    @IsString()
    @IsOptional()
    dataVectorModel?: string;

    @ApiProperty({ description: 'Modelo de embeddings do vetor de dados' })
    @IsString()
    @IsOptional()
    dataVectorEmbeddingsModel?: string;
}

export class UpdateStatusDto {
    @ApiProperty({ description: 'Status de ativação do chatbot' })
    @IsBoolean()
    isActive: boolean;
} 