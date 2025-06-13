import { ApiProperty } from "@nestjs/swagger";

export class SimilarChunkResponseDto {
    @ApiProperty({
        description: 'ID do chunk',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    id: string;

    @ApiProperty({
        description: 'Conteúdo do chunk',
        example: 'Este é um exemplo de conteúdo do chunk...'
    })
    content: string;

    @ApiProperty({
        description: 'Score de similaridade (0 a 1)',
        example: 0.95
    })
    similarity: number;

    @ApiProperty({
        description: 'Status de habilitação do chunk',
        example: true
    })
    enable: boolean;

    @ApiProperty({
        description: 'Metadados do chunk',
        example: {
            tokenCount: 150,
            pageNumber: 1,
            section: 'Introdução'
        }
    })
    meta?: {
        tokenCount?: number;
        pageNumber?: number;
        section?: string;
    };

    @ApiProperty({
        description: 'URL para atualizar o status do chunk',
        example: '/user/knowledge/123/chunks/456/status'
    })
    statusUrl: string;
} 