import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class OpenAIEmbeddingService {
    private readonly logger = new Logger(OpenAIEmbeddingService.name);
    private readonly apiKey = process.env.OPENAI_API_KEY;

    async generateEmbedding(text: string): Promise<number[]> {
        this.logger.debug(`Iniciando geração de embedding para texto: "${text}"`);
        this.logger.debug(`Tamanho do texto: ${text.length} caracteres`);

        if (!text || text.trim().length === 0) {
            this.logger.error('Texto vazio recebido para geração de embedding');
            throw new Error('Texto não pode estar vazio para geração de embedding');
        }

        if (!this.apiKey) {
            this.logger.error('OPENAI_API_KEY não configurada');
            throw new Error('OPENAI_API_KEY não configurada');
        }

        try {
            this.logger.debug('Enviando requisição para API da OpenAI');
            const response = await axios.post(
                'https://api.openai.com/v1/embeddings',
                {
                    input: text,
                    model: 'text-embedding-3-small'
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const embedding = response.data.data[0].embedding;
            this.logger.debug(`Embedding gerado com sucesso. Tamanho: ${embedding.length}`);
            this.logger.debug(`Primeiros 5 valores do embedding: ${embedding.slice(0, 5)}`);

            if (!Array.isArray(embedding) || embedding.length === 0) {
                this.logger.error('Embedding inválido retornado pela API');
                throw new Error('Embedding inválido retornado pela API');
            }

            return embedding;
        } catch (error) {
            this.logger.error(`Erro ao gerar embedding: ${error.message}`, error.stack);
            throw error;
        }
    }
} 