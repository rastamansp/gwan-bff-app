import { Injectable, Logger } from '@nestjs/common';
import { IDocumentEmbeddingRepository } from '../entities/document-embedding.entity';
import { DocumentEmbedding } from '../entities/document-embedding.entity';
import { OpenAIEmbeddingService } from './openai-embedding.service';
import { Inject } from '@nestjs/common';
import { DOCUMENT_EMBEDDING_REPOSITORY } from '../entities/document-embedding.entity';

@Injectable()
export class EmbeddingService {
    private readonly logger = new Logger(EmbeddingService.name);

    constructor(
        @Inject(DOCUMENT_EMBEDDING_REPOSITORY)
        private readonly documentEmbeddingRepository: IDocumentEmbeddingRepository,
        private readonly openAIEmbeddingService: OpenAIEmbeddingService
    ) { }

    async findByKnowledgeBaseId(knowledgeBaseId: string, userId: string): Promise<DocumentEmbedding[]> {
        this.logger.debug(`Buscando embeddings para base ${knowledgeBaseId} do usuário ${userId}`);
        return this.documentEmbeddingRepository.findByKnowledgeBaseId(knowledgeBaseId, userId);
    }

    async findBySimilarity(
        knowledgeBaseId: string,
        userId: string,
        embedding: number[],
        limit: number = 5,
        onlyEnabled: boolean = true
    ): Promise<DocumentEmbedding[]> {
        this.logger.debug(
            `Buscando embeddings similares para base ${knowledgeBaseId} do usuário ${userId}`
        );
        return this.documentEmbeddingRepository.findBySimilarity(
            knowledgeBaseId,
            userId,
            embedding,
            limit,
            onlyEnabled
        );
    }

    async create(embedding: Partial<DocumentEmbedding>): Promise<DocumentEmbedding> {
        this.logger.debug(`Criando novo embedding para base ${embedding.knowledgeBaseId}`);
        return this.documentEmbeddingRepository.create(embedding);
    }

    async deleteByKnowledgeBaseId(knowledgeBaseId: string): Promise<void> {
        this.logger.debug(`Removendo embeddings da base ${knowledgeBaseId}`);
        await this.documentEmbeddingRepository.deleteByKnowledgeBaseId(knowledgeBaseId);
    }

    async updateChunkStatus(id: string, userId: string, enable: boolean): Promise<DocumentEmbedding> {
        this.logger.debug(`Atualizando status do chunk ${id} para ${enable ? 'ativo' : 'inativo'}`);
        return this.documentEmbeddingRepository.updateChunkStatus(id, userId, enable);
    }

    async deleteChunk(id: string, userId: string): Promise<void> {
        this.logger.debug(`Deletando chunk ${id} do usuário ${userId}`);
        await this.documentEmbeddingRepository.deleteChunk(id, userId);
    }

    async updateChunkContent(
        id: string,
        userId: string,
        content: string,
        openAIEmbeddingService: OpenAIEmbeddingService
    ): Promise<DocumentEmbedding> {
        this.logger.log(`Atualizando conteúdo do chunk ${id} para o usuário ${userId}`);

        // Primeiro atualiza o conteúdo e metadados
        const updatedChunk = await this.documentEmbeddingRepository.updateChunkContent(
            id,
            userId,
            content
        );

        // Gera o novo embedding para o conteúdo atualizado
        const embedding = await openAIEmbeddingService.generateEmbedding(content);

        // Atualiza o embedding do chunk
        return this.documentEmbeddingRepository.updateChunkEmbedding(id, userId, embedding);
    }

    async deleteByBucketFileId(bucketFileId: string): Promise<void> {
        this.logger.log(`Deleting chunks for bucket file ${bucketFileId}`);
        await this.documentEmbeddingRepository.deleteByBucketFileId(bucketFileId);
        this.logger.log(`Chunks for bucket file ${bucketFileId} deleted successfully`);
    }
} 