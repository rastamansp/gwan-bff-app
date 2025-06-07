import { Injectable, Logger } from '@nestjs/common';
import { IDocumentEmbeddingRepository } from '../entities/document-embedding.entity';
import { DocumentEmbedding } from '../entities/document-embedding.entity';

@Injectable()
export class EmbeddingService {
    private readonly logger = new Logger(EmbeddingService.name);

    constructor(
        private readonly embeddingRepository: IDocumentEmbeddingRepository
    ) { }

    async findByKnowledgeBaseId(knowledgeBaseId: string, userId: string): Promise<DocumentEmbedding[]> {
        this.logger.debug(`Buscando embeddings para base ${knowledgeBaseId} do usuário ${userId}`);
        return this.embeddingRepository.findByKnowledgeBaseId(knowledgeBaseId, userId);
    }

    async findBySimilarity(
        knowledgeBaseId: string,
        userId: string,
        embedding: number[],
        limit: number = 5
    ): Promise<DocumentEmbedding[]> {
        this.logger.debug(
            `Buscando embeddings similares para base ${knowledgeBaseId} do usuário ${userId}`
        );
        return this.embeddingRepository.findBySimilarity(knowledgeBaseId, userId, embedding, limit);
    }

    async create(embedding: Partial<DocumentEmbedding>): Promise<DocumentEmbedding> {
        this.logger.debug(`Criando novo embedding para base ${embedding.knowledgeBaseId}`);
        return this.embeddingRepository.create(embedding);
    }

    async deleteByKnowledgeBaseId(knowledgeBaseId: string): Promise<void> {
        this.logger.debug(`Removendo embeddings da base ${knowledgeBaseId}`);
        await this.embeddingRepository.deleteByKnowledgeBaseId(knowledgeBaseId);
    }
} 