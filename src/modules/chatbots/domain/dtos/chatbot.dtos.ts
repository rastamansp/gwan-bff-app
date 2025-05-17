import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max, IsBoolean, IsUrl } from 'class-validator';
import { Type } from '@nestjs/common';

@ApiSchema({ name: 'ChatbotResponseModel' })
export class ChatbotResponseDto {
    @ApiProperty({ description: 'ID único do chatbot' })
    id: string;

    @ApiProperty({ description: 'Nome do chatbot' })
    name: string;

    @ApiProperty({ description: 'Descrição do chatbot' })
    description: string;

    @ApiProperty({ description: 'Prompt do sistema para o chatbot' })
    systemPrompt: string;

    @ApiProperty({ description: 'Modelo de IA utilizado' })
    aiModel: string;

    @ApiProperty({ description: 'Tamanho da janela de contexto' })
    contentWindowSize: number;

    @ApiProperty({ description: 'ID do chatbot no n8n', required: false })
    n8nId?: string;

    @ApiProperty({ description: 'ID do workflow no n8n', required: false })
    n8nWorkflowId?: string;

    @ApiProperty({ description: 'URL do webhook do chat no n8n', required: false })
    n8nChatUrl?: string;

    @ApiProperty({ description: 'Se o chat requer clique no botão para iniciar', required: false })
    n8nChatRequireButtonClicktoStart?: boolean;

    @ApiProperty({ description: 'Título do chat', required: false })
    n8nChatTitle?: string;

    @ApiProperty({ description: 'Subtítulo do chat', required: false })
    n8nChatSubtitle?: string;

    @ApiProperty({ description: 'Mensagem inicial do chat', required: false })
    n8nChatInitialMessage?: string;

    @ApiProperty({ description: 'Nome do vetor de dados', required: false })
    dataVector?: string;

    @ApiProperty({ description: 'Tamanho do vetor de dados', required: false })
    dataVectorSize?: number;

    @ApiProperty({ description: 'Índice do vetor de dados', required: false })
    dataVectorIndex?: string;

    @ApiProperty({ description: 'Namespace do vetor de dados', required: false })
    dataVectorNamespace?: string;

    @ApiProperty({ description: 'Modelo do vetor de dados', required: false })
    dataVectorModel?: string;

    @ApiProperty({ description: 'Modelo de embeddings do vetor de dados', required: false })
    dataVectorEmbeddingsModel?: string;

    @ApiProperty({ description: 'Status de ativação do chatbot' })
    isActive: boolean;

    @ApiProperty({ description: 'ID do usuário proprietário do chatbot' })
    userId: string;

    @ApiProperty({ description: 'Data de criação do chatbot' })
    createdAt: Date;

    @ApiProperty({ description: 'Data da última atualização do chatbot' })
    updatedAt: Date;
}

@ApiSchema({ name: 'ChatbotListResponseModel' })
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

@ApiSchema({ name: 'ChatbotCreateModel' })
export class CreateChatbotDto {
    @ApiProperty({
        description: 'Nome do chatbot'
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

@ApiSchema({ name: 'ChatbotUpdateRequestModel' })
export class UpdateChatbotRequestDto {
    @ApiProperty({
        description: 'Nome do chatbot'
    })
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
    aiModel?: string;

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

@ApiSchema({ name: 'ChatbotN8nConfigModel' })
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

@ApiSchema({ name: 'ChatbotVectorConfigModel' })
export class UpdateVectorConfigDto {
    @ApiProperty({
        description: 'Nome do vetor de dados'
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

@ApiSchema({ name: 'ChatbotStatusUpdateModel' })
export class UpdateChatbotStatusDto {
    @ApiProperty({
        description: 'Status de ativação do chatbot',
        type: Boolean,
        example: true
    })
    @IsBoolean()
    @IsNotEmpty()
    isActive: boolean;
} 