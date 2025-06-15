import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: 'CrawlResponseModel' })
export class CrawlResponseDto {
    @ApiProperty({ description: 'ID da requisição de crawling' })
    id: string;

    @ApiProperty({ description: 'URL processada' })
    url: string;

    @ApiProperty({ description: 'Status do processamento' })
    status: 'pending' | 'processing' | 'completed' | 'failed';

    @ApiProperty({ description: 'Resultado do crawling', required: false })
    result?: any;

    @ApiProperty({ description: 'Erro ocorrido', required: false })
    error?: string;

    @ApiProperty({ description: 'Data de criação' })
    createdAt: Date;

    @ApiProperty({ description: 'Data de atualização' })
    updatedAt: Date;
} 