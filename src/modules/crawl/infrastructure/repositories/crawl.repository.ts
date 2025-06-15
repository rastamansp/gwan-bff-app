import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICrawlRepository } from '../../domain/interfaces/crawl-repository.interface';
import { CrawlRequest } from '../../domain/entities/crawl-request.entity';
import { CrawlRequestDocument, CrawlRequestSchema } from '../schemas/crawl-request.schema';

@Injectable()
export class CrawlRepository implements ICrawlRepository {
    private readonly logger = new Logger(CrawlRepository.name);

    constructor(
        @InjectModel('CrawlRequest')
        private readonly crawlRequestModel: Model<CrawlRequestDocument>,
    ) { }

    async create(crawlRequest: Partial<CrawlRequest>): Promise<CrawlRequest> {
        this.logger.debug(`Criando nova requisição de crawling para URL: ${crawlRequest.url}`);

        const createdRequest = new this.crawlRequestModel({
            ...crawlRequest,
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const savedRequest = await createdRequest.save();
        this.logger.log(`Requisição de crawling criada com ID: ${savedRequest.id}`);

        return this.mapToEntity(savedRequest);
    }

    async findById(id: string): Promise<CrawlRequest | null> {
        const request = await this.crawlRequestModel.findById(id).exec();
        return request ? this.mapToEntity(request) : null;
    }

    async findByUserId(userId: string): Promise<CrawlRequest[]> {
        const requests = await this.crawlRequestModel.find({ userId }).exec();
        return requests.map(request => this.mapToEntity(request));
    }

    async update(id: string, data: Partial<CrawlRequest>): Promise<CrawlRequest> {
        this.logger.debug(`Atualizando requisição de crawling ${id}`);

        const updatedRequest = await this.crawlRequestModel
            .findByIdAndUpdate(
                id,
                { ...data, updatedAt: new Date() },
                { new: true }
            )
            .exec();

        if (!updatedRequest) {
            throw new Error(`Requisição de crawling com ID ${id} não encontrada`);
        }

        return this.mapToEntity(updatedRequest);
    }

    async delete(id: string): Promise<void> {
        this.logger.debug(`Deletando requisição de crawling ${id}`);
        await this.crawlRequestModel.findByIdAndDelete(id).exec();
    }

    private mapToEntity(document: CrawlRequestDocument): CrawlRequest {
        return {
            id: document._id.toString(),
            userId: document.userId.toString(),
            url: document.url,
            formats: document.formats,
            jsonOptions: document.jsonOptions,
            status: document.status,
            result: document.result,
            error: document.error,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt,
        };
    }
} 