import { Injectable, Logger, Inject } from '@nestjs/common';
import { ICrawlRepository } from '../../../domain/interfaces/crawl-repository.interface';
import { CrawlResponseDto } from '../../../domain/dtos/crawl-response.dto';
import { CRAWL_REPOSITORY } from '../../../domain/constants/injection-tokens';

@Injectable()
export class ListCrawlRequestsUseCase {
    private readonly logger = new Logger(ListCrawlRequestsUseCase.name);

    constructor(
        @Inject(CRAWL_REPOSITORY)
        private readonly crawlRepository: ICrawlRepository,
    ) { }

    async execute(userId: string): Promise<CrawlResponseDto[]> {
        this.logger.log(`Listando requisições de crawling para usuário ${userId}`);

        const crawlRequests = await this.crawlRepository.findByUserId(userId);

        return crawlRequests.map(request => this.mapToResponseDto(request));
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