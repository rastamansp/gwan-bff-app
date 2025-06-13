import { Injectable, Logger, Inject, NotFoundException } from '@nestjs/common';
import { ICrawlRepository } from '../../../domain/interfaces/crawl-repository.interface';
import { CrawlResponseDto } from '../../../domain/dtos/crawl-response.dto';
import { CRAWL_REPOSITORY } from '../../../domain/constants/injection-tokens';

@Injectable()
export class GetCrawlRequestUseCase {
    private readonly logger = new Logger(GetCrawlRequestUseCase.name);

    constructor(
        @Inject(CRAWL_REPOSITORY)
        private readonly crawlRepository: ICrawlRepository,
    ) { }

    async execute(id: string, userId: string): Promise<CrawlResponseDto> {
        this.logger.log(`Buscando requisição de crawling ${id} para usuário ${userId}`);

        const crawlRequest = await this.crawlRepository.findById(id);

        if (!crawlRequest) {
            throw new NotFoundException('Requisição de crawling não encontrada');
        }

        if (crawlRequest.userId !== userId) {
            throw new NotFoundException('Requisição de crawling não pertence ao usuário');
        }

        return this.mapToResponseDto(crawlRequest);
    }

    private mapToResponseDto(crawlRequest: any): CrawlResponseDto {
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