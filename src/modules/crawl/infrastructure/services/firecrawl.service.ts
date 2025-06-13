import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ICrawlService } from '../../domain/interfaces/crawl-service.interface';
import axios from 'axios';

@Injectable()
export class FirecrawlService implements ICrawlService {
    private readonly logger = new Logger(FirecrawlService.name);
    private readonly apiUrl: string;

    constructor(private readonly configService: ConfigService) {
        this.apiUrl = this.configService.get<string>('FIRECRAWL_API_URL', 'https://firecrawl.gwan.com.br');
    }

    async scrapeUrl(url: string, formats: string[], jsonOptions?: any): Promise<any> {
        this.logger.log(`Iniciando crawling da URL: ${url}`);

        try {
            const payload = {
                url,
                formats,
                ...(jsonOptions && { jsonOptions })
            };

            this.logger.debug(`Payload enviado para Firecrawl: ${JSON.stringify(payload)}`);

            const response = await axios.post(`${this.apiUrl}/v1/scrape`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 30000, // 30 segundos de timeout
            });

            this.logger.log(`Crawling concluído com sucesso para URL: ${url}`);
            return response.data;

        } catch (error) {
            this.logger.error(`Erro ao fazer crawling da URL ${url}:`, error.message);
            throw new Error(`Falha no crawling: ${error.message}`);
        }
    }
} 