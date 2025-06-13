import { Prop, Schema } from "@nestjs/mongoose";
import { Document } from "mongoose";

export const DOCUMENT_EMBEDDING_REPOSITORY = 'DOCUMENT_EMBEDDING_REPOSITORY';

export interface DocumentEmbedding {
    id: string;
    knowledgeBaseId: string;
    userId: string;
    bucketFileId: string;
    chunkIndex: number;
    content: string;
    embedding: number[];
    similarity?: number;
    enable: boolean;
    meta?: {
        tokenCount?: number;
        pageNumber?: number;
        section?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

// Interface para o repositório PostgreSQL
export interface IDocumentEmbeddingRepository {
    findByKnowledgeBaseId(knowledgeBaseId: string, userId: string): Promise<DocumentEmbedding[]>;
    findBySimilarity(
        knowledgeBaseId: string,
        userId: string,
        embedding: number[],
        limit?: number,
        onlyEnabled?: boolean
    ): Promise<DocumentEmbedding[]>;
    create(embedding: Partial<DocumentEmbedding>): Promise<DocumentEmbedding>;
    deleteByKnowledgeBaseId(knowledgeBaseId: string): Promise<void>;
    updateChunkStatus(id: string, userId: string, enable: boolean): Promise<DocumentEmbedding>;
    deleteChunk(id: string, userId: string): Promise<void>;
    updateChunkContent(id: string, userId: string, content: string): Promise<DocumentEmbedding>;
    updateChunkEmbedding(id: string, userId: string, embedding: number[]): Promise<DocumentEmbedding>;
    deleteByBucketFileId(bucketFileId: string): Promise<void>;
} 