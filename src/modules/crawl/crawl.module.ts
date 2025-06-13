import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CrawlController } from './presentation/controllers/crawl.controller';
import { CreateCrawlRequestUseCase } from './application/use-cases/create-crawl-request/create-crawl-request.usecase';
import { GetCrawlRequestUseCase } from './application/use-cases/get-crawl-request/get-crawl-request.usecase';
import { ListCrawlRequestsUseCase } from './application/use-cases/list-crawl-requests/list-crawl-requests.usecase';
import { CrawlRepository } from './infrastructure/repositories/crawl.repository';
import { FirecrawlService } from './infrastructure/services/firecrawl.service';
import { CrawlRequestSchema, CrawlRequestSchemaFactory } from './infrastructure/schemas/crawl-request.schema';
import { CRAWL_REPOSITORY, CRAWL_SERVICE } from './domain/constants/injection-tokens';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: CrawlRequestSchema.name, schema: CrawlRequestSchemaFactory },
        ]),
        ConfigModule,
    ],
    controllers: [CrawlController],
    providers: [
        {
            provide: CRAWL_REPOSITORY,
            useClass: CrawlRepository,
        },
        {
            provide: CRAWL_SERVICE,
            useClass: FirecrawlService,
        },
        CreateCrawlRequestUseCase,
        GetCrawlRequestUseCase,
        ListCrawlRequestsUseCase,
        CrawlRepository,
        FirecrawlService,
    ],
    exports: [
        CRAWL_REPOSITORY,
        CRAWL_SERVICE,
        CreateCrawlRequestUseCase,
        GetCrawlRequestUseCase,
        ListCrawlRequestsUseCase,
    ],
})
export class CrawlModule { } 