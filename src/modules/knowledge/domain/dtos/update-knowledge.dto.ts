import { IsArray, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: 'KnowledgeUpdate' })
export class UpdateKnowledgeDto {
    @ApiProperty({
        description: 'Título do conhecimento',
        required: false,
        name: 'KnowledgeUpdateDto'
    })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({ description: 'Conteúdo do conhecimento', required: false })
    @IsOptional()
    @IsString()
    content?: string;

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];
} 