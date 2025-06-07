import { Injectable, Logger } from '@nestjs/common';
import { Pool } from 'pg';
import { IDocumentEmbeddingRepository } from '../../domain/entities/document-embedding.entity';
import { DocumentEmbedding } from '../../domain/entities/document-embedding.entity';

@Injectable()
export class PostgresDocumentEmbeddingRepository implements IDocumentEmbeddingRepository {
    private readonly logger = new Logger(PostgresDocumentEmbeddingRepository.name);
    private pool: Pool;

    constructor() {
        const postgresUrl = process.env.POSTGRES_URL;

        if (!postgresUrl) {
            this.logger.error('POSTGRES_URL não encontrada nas variáveis de ambiente');
            throw new Error('POSTGRES_URL não configurada');
        }

        this.pool = new Pool({
            connectionString: postgresUrl,
        });

        this.initializeDatabase();
    }

    private async initializeDatabase() {
        const client = await this.pool.connect();
        try {
            // Apenas verifica se a tabela existe
            const result = await client.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_name = 'document_embeddings'
                );
            `);

            if (!result.rows[0].exists) {
                this.logger.warn('Tabela document_embeddings não encontrada. Por favor, execute as migrações necessárias.');
            } else {
                this.logger.log('Tabela document_embeddings encontrada.');
            }
        } catch (error) {
            this.logger.error('Erro ao verificar banco de dados:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    async findByKnowledgeBaseId(knowledgeBaseId: string, userId: string): Promise<DocumentEmbedding[]> {
        const result = await this.pool.query(
            `SELECT * FROM document_embeddings 
             WHERE knowledge_base_id = $1 AND user_id = $2 
             ORDER BY chunk_index ASC`,
            [knowledgeBaseId, userId]
        );

        return result.rows.map(this.mapRowToEntity);
    }

    async findBySimilarity(
        knowledgeBaseId: string,
        userId: string,
        embedding: number[],
        limit: number = 5
    ): Promise<DocumentEmbedding[]> {
        this.logger.debug(`Iniciando busca por similaridade para knowledgeBaseId: ${knowledgeBaseId}, userId: ${userId}`);
        this.logger.debug(`Embedding recebido: ${JSON.stringify(embedding)}`);
        this.logger.debug(`Tipo do embedding: ${typeof embedding}, É array: ${Array.isArray(embedding)}, Tamanho: ${embedding?.length}`);

        if (!embedding || !Array.isArray(embedding) || embedding.length === 0) {
            this.logger.error('Embedding inválido recebido');
            throw new Error('Embedding inválido: deve ser um array não vazio de números');
        }

        try {
            // Garantir que o embedding seja um array de números
            const vectorArray = embedding.map(Number);

            // Converter para o formato que o pgvector espera
            const vectorString = `[${vectorArray.join(',')}]`;

            this.logger.debug(`Vector formatado para PostgreSQL: ${vectorString}`);

            const result = await this.pool.query(
                `SELECT *, 1 - (embedding <=> $1::vector) as similarity 
                 FROM document_embeddings 
                 WHERE knowledge_base_id = $2 AND user_id = $3 
                 ORDER BY embedding <=> $1::vector 
                 LIMIT $4`,
                [vectorString, knowledgeBaseId, userId, limit]
            );

            this.logger.debug(`Busca concluída. Encontrados ${result.rows.length} resultados`);
            return result.rows.map(this.mapRowToEntity);
        } catch (error) {
            this.logger.error(`Erro na busca por similaridade: ${error.message}`, error.stack);
            throw error;
        }
    }

    async create(embedding: Partial<DocumentEmbedding>): Promise<DocumentEmbedding> {
        const result = await this.pool.query(
            `INSERT INTO document_embeddings 
             (knowledge_base_id, user_id, bucket_file_id, chunk_index, content, embedding, meta) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) 
             RETURNING *`,
            [
                embedding.knowledgeBaseId,
                embedding.userId,
                embedding.bucketFileId,
                embedding.chunkIndex,
                embedding.content,
                embedding.embedding,
                embedding.meta ? JSON.stringify(embedding.meta) : null
            ]
        );

        return this.mapRowToEntity(result.rows[0]);
    }

    async deleteByKnowledgeBaseId(knowledgeBaseId: string): Promise<void> {
        await this.pool.query(
            'DELETE FROM document_embeddings WHERE knowledge_base_id = $1',
            [knowledgeBaseId]
        );
    }

    private mapRowToEntity(row: any): DocumentEmbedding {
        return {
            id: row.id.toString(),
            knowledgeBaseId: row.knowledge_base_id,
            userId: row.user_id,
            bucketFileId: row.bucket_file_id,
            chunkIndex: row.chunk_index,
            content: row.content,
            embedding: row.embedding,
            meta: row.meta,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        };
    }
} 