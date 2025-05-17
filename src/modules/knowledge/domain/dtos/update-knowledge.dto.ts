import { IsArray, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: 'KnowledgeUpdateModel' })
export class UpdateKnowledgeDto {
    @ApiProperty({
        description: 'Título do conhecimento',
        required: false
    })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({ description: 'Conteúdo do conhecimento', required: false })
    @IsOptional()
    @IsString()
    content?: string;

    @ApiProperty({ description: 'Categoria do conhecimento', required: false })
    @IsOptional()
    @IsString()
    category?: string;

    @ApiProperty({ description: 'Tags do conhecimento', required: false, type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];
} 