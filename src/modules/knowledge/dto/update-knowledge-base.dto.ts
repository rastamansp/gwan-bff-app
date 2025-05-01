import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum KnowledgeBaseStatus {
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    ERROR = 'error'
}

export class UpdateKnowledgeBaseDto {
    @ApiProperty({ description: 'Nome da base de conhecimento', required: false })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ description: 'Descrição da base de conhecimento', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'Status da base de conhecimento',
        enum: KnowledgeBaseStatus,
        required: false
    })
    @IsEnum(KnowledgeBaseStatus)
    @IsOptional()
    status?: KnowledgeBaseStatus;

    @ApiProperty({ description: 'Mensagem de erro, se houver', required: false })
    @IsString()
    @IsOptional()
    error?: string;
} 