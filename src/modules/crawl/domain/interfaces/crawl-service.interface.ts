import { CrawlRequest } from '../entities/crawl-request.entity';

export interface ICrawlService {
    scrapeUrl(url: string, formats: string[], jsonOptions?: any): Promise<any>;
} 