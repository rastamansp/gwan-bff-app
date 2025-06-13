import { Injectable, Logger, Inject } from '@nestjs/common';
import { ICrawlRepository } from '../../../domain/interfaces/crawl-repository.interface';
import { ICrawlService } from '../../../domain/interfaces/crawl-service.interface';
import { CreateCrawlRequestDto } from '../../../domain/dtos/create-crawl-request.dto';
import { CrawlResponseDto } from '../../../domain/dtos/crawl-response.dto';
import { CrawlRequest } from '../../../domain/entities/crawl-request.entity';
import { CRAWL_REPOSITORY, CRAWL_SERVICE } from '../../../domain/constants/injection-tokens';

@Injectable()
export class CreateCrawlRequestUseCase {
    private readonly logger = new Logger(CreateCrawlRequestUseCase.name);

    constructor(
        @Inject(CRAWL_REPOSITORY)
        private readonly crawlRepository: ICrawlRepository,
        @Inject(CRAWL_SERVICE)
        private readonly crawlService: ICrawlService,
    ) { }

    async execute(dto: CreateCrawlRequestDto, userId: string): Promise<CrawlResponseDto> {
        this.logger.log(`Iniciando criação de requisição de crawling para usuário ${userId}`);

        // Criar a requisição no banco de dados
        const crawlRequest = await this.crawlRepository.create({
            userId,
            url: dto.url,
            formats: dto.formats,
            jsonOptions: dto.jsonOptions,
        });

        // Processar o crawling de forma assíncrona
        this.processCrawlingAsync(crawlRequest.id, dto);

        return this.mapToResponseDto(crawlRequest);
    }

    private async processCrawlingAsync(requestId: string, dto: CreateCrawlRequestDto): Promise<void> {
        try {
            // Atualizar status para processing
            await this.crawlRepository.update(requestId, { status: 'processing' });

            // Executar o crawling
            const result = await this.crawlService.scrapeUrl(
                dto.url,
                dto.formats,
                dto.jsonOptions
            );

            // Atualizar com o resultado
            await this.crawlRepository.update(requestId, {
                status: 'completed',
                result,
            });

            this.logger.log(`Crawling concluído com sucesso para requisição ${requestId}`);

        } catch (error) {
            this.logger.error(`Erro no crawling para requisição ${requestId}:`, error.message);

            // Atualizar com o erro
            await this.crawlRepository.update(requestId, {
                status: 'failed',
                error: error.message,
            });
        }
    }

    private mapToResponseDto(crawlRequest: CrawlRequest): CrawlResponseDto {
        return {
            id: crawlRequest.id,
            url: crawlRequest.url,
            status: crawlRequest.status,
            result: crawlRequest.result,
            error: crawlRequest.error,
            createdAt: crawlRequest.createdAt,
            updatedAt: crawlRequest.updatedAt,
        };
    }
} 