import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: 'KnowledgeResponseModel' })
export class KnowledgeResponseDto {
    @ApiProperty({ description: 'ID do conhecimento' })
    id: string;

    @ApiProperty({ description: 'Título do conhecimento' })
    title: string;

    @ApiProperty({ description: 'Conteúdo do conhecimento' })
    content: string;

    @ApiProperty({ description: 'Categoria do conhecimento' })
    category: string;

    @ApiProperty({ description: 'Tags do conhecimento', type: [String] })
    tags: string[];

    @ApiProperty({ description: 'ID do autor do conhecimento' })
    authorId: string;

    @ApiProperty({ description: 'Data de criação do conhecimento' })
    createdAt: Date;

    @ApiProperty({ description: 'Data de atualização do conhecimento' })
    updatedAt: Date;
} 