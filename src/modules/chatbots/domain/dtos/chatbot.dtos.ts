import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max, IsBoolean, IsUrl } from 'class-validator';
import { Type } from '@nestjs/common';

@ApiSchema({ name: 'ChatbotResponse' })
export class ChatbotResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    systemPrompt: string;

    @ApiProperty()
    aiModel: string;

    @ApiProperty()
    contentWindowSize: number;

    @ApiProperty()
    n8nId?: string;

    @ApiProperty()
    n8nWorkflowId?: string;

    @ApiProperty()
    n8nChatUrl?: string;

    @ApiProperty()
    n8nChatRequireButtonClicktoStart?: boolean;

    @ApiProperty()
    n8nChatTitle?: string;

    @ApiProperty()
    n8nChatSubtitle?: string;

    @ApiProperty()
    n8nChatInitialMessage?: string;

    @ApiProperty()
    dataVector?: string;

    @ApiProperty()
    dataVectorSize?: number;

    @ApiProperty()
    dataVectorIndex?: string;

    @ApiProperty()
    dataVectorNamespace?: string;

    @ApiProperty()
    dataVectorModel?: string;

    @ApiProperty()
    dataVectorEmbeddingsModel?: string;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

@ApiSchema({ name: 'ChatbotListResponse' })
export class ListChatbotsResponseDto {
    @ApiProperty({ type: () => [ChatbotResponseDto] })
    data: ChatbotResponseDto[];

    @ApiProperty()
    total: number;

    @ApiProperty()
    page: number;

    @ApiProperty()
    limit: number;
}

@ApiSchema({ name: 'ChatbotCreate' })
export class CreateChatbotDto {
    @ApiProperty({
        description: 'Nome do chatbot',
        name: 'ChatbotCreateDto'
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'Descrição do chatbot' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ description: 'Prompt do sistema para o chatbot' })
    @IsString()
    @IsNotEmpty()
    systemPrompt: string;

    @ApiProperty({ description: 'Modelo de IA utilizado' })
    @IsString()
    @IsNotEmpty()
    aiModel: string;

    @ApiProperty({ description: 'Tamanho da janela de contexto', default: 12 })
    @IsNumber()
    @Min(1)
    @Max(32)
    @IsOptional()
    contentWindowSize?: number;

    @ApiProperty({ description: 'Máximo de tokens para respostas da IA', default: 2000 })
    @IsNumber()
    @Min(1)
    @IsOptional()
    maxTokens?: number;
}

@ApiSchema({ name: 'ChatbotUpdate' })
export class UpdateChatbotDto {
    @ApiProperty({
        description: 'Nome do chatbot',
        name: 'ChatbotUpdateDto'
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ description: 'Descrição do chatbot' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ description: 'Prompt do sistema para o chatbot' })
    @IsString()
    @IsNotEmpty()
    systemPrompt: string;

    @ApiProperty({ description: 'Modelo de IA utilizado' })
    @IsString()
    @IsNotEmpty()
    aiModel: string;

    @ApiProperty({ description: 'Tamanho da janela de contexto', default: 12 })
    @IsNumber()
    @Min(1)
    @Max(32)
    @IsOptional()
    contentWindowSize?: number;

    @ApiProperty({ description: 'Máximo de tokens para respostas da IA', default: 2000 })
    @IsNumber()
    @Min(1)
    @IsOptional()
    maxTokens?: number;
}

@ApiSchema({ name: 'ChatbotN8nConfig' })
export class UpdateN8nConfigDto {
    @ApiProperty({ description: 'ID do chatbot no n8n' })
    @IsString()
    @IsNotEmpty()
    n8nId: string;

    @ApiProperty({ description: 'ID do workflow no n8n' })
    @IsString()
    @IsNotEmpty()
    n8nWorkflowId: string;

    @ApiProperty({ description: 'URL do webhook do chat no n8n' })
    @IsUrl()
    @IsNotEmpty()
    n8nChatUrl: string;

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

@ApiSchema({ name: 'ChatbotVectorConfig' })
export class UpdateVectorConfigDto {
    @ApiProperty({
        description: 'Nome do vetor de dados',
        name: 'ChatbotVectorConfigDto'
    })
    @IsString()
    @IsNotEmpty()
    dataVector: string;

    @ApiProperty({ description: 'Tamanho do vetor de dados' })
    @IsNumber()
    @Min(1)
    @IsNotEmpty()
    dataVectorSize: number;

    @ApiProperty({ description: 'Índice do vetor de dados' })
    @IsString()
    @IsNotEmpty()
    dataVectorIndex: string;

    @ApiProperty({ description: 'Namespace do vetor de dados' })
    @IsString()
    @IsNotEmpty()
    dataVectorNamespace: string;

    @ApiProperty({ description: 'Modelo do vetor de dados' })
    @IsString()
    @IsNotEmpty()
    dataVectorModel: string;

    @ApiProperty({ description: 'Modelo de embeddings do vetor de dados' })
    @IsString()
    @IsNotEmpty()
    dataVectorEmbeddingsModel: string;
}

@ApiSchema({ name: 'ChatbotStatus' })
export class UpdateStatusDto {
    @ApiProperty({
        description: 'Status de ativação do chatbot',
        name: 'ChatbotStatusDto'
    })
    @IsBoolean()
    @IsNotEmpty()
    isActive: boolean;
} 