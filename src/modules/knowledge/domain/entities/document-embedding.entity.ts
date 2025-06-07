import { Prop, Schema } from "@nestjs/mongoose";
import { Document } from "mongoose";

export class DocumentEmbedding {
    id: string;
    knowledgeBaseId: string;
    userId: string;
    bucketFileId: string;
    chunkIndex: number;
    content: string;
    embedding: number[];
    similarity?: number;
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
    findBySimilarity(knowledgeBaseId: string, userId: string, embedding: number[], limit: number): Promise<DocumentEmbedding[]>;
    create(embedding: Partial<DocumentEmbedding>): Promise<DocumentEmbedding>;
    deleteByKnowledgeBaseId(knowledgeBaseId: string): Promise<void>;
} 