import { CrawlRequest } from '../entities/crawl-request.entity';

export interface ICrawlRepository {
    create(crawlRequest: Partial<CrawlRequest>): Promise<CrawlRequest>;
    findById(id: string): Promise<CrawlRequest | null>;
    findByUserId(userId: string): Promise<CrawlRequest[]>;
    update(id: string, data: Partial<CrawlRequest>): Promise<CrawlRequest>;
    delete(id: string): Promise<void>;
} 