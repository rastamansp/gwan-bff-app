import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateKnowledgeDto {
    @ApiProperty({ description: 'Título do conhecimento' })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({ description: 'Conteúdo do conhecimento' })
    @IsNotEmpty()
    @IsString()
    content: string;

    @ApiProperty({ description: 'Categoria do conhecimento' })
    @IsNotEmpty()
    @IsString()
    category: string;

    @ApiProperty({ description: 'Tags do conhecimento', required: false })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];
} 