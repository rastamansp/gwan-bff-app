import { Injectable, Logger, Inject, NotFoundException } from '@nestjs/common';
import { IKnowledgeBaseRepository } from '../../../domain/interfaces/knowledge-base.repository.interface';
import { RabbitMQService } from '../../../../rabbitmq/rabbitmq.service';
import { KNOWLEDGE_BASE_REPOSITORY } from '../../../knowledge.module';
import { BUCKET_FILE_REPOSITORY } from '../../../../dataset/domain/constants/injection-tokens';
import { IBucketFileRepository } from '../../../../dataset/domain/repositories/bucket-file.repository';
import { FileStatus } from '../../../../dataset/domain/entities/bucket-file.entity';

@Injectable()
export class StartProcessUseCase {
    private readonly logger = new Logger(StartProcessUseCase.name);

    constructor(
        @Inject(KNOWLEDGE_BASE_REPOSITORY)
        private readonly knowledgeBaseRepository: IKnowledgeBaseRepository,
        @Inject(BUCKET_FILE_REPOSITORY)
        private readonly bucketFileRepository: IBucketFileRepository,
        private readonly rabbitMQService: RabbitMQService,
    ) { }

    async execute(knowledgeBaseId: string, userId: string, bucketFileId: string): Promise<void> {
        this.logger.log(`Starting process for knowledge base ${knowledgeBaseId} and file ${bucketFileId}`);

        // Busca a base de conhecimento
        const knowledgeBase = await this.knowledgeBaseRepository.findById(knowledgeBaseId);
        if (!knowledgeBase) {
            throw new NotFoundException(`Knowledge base with id ${knowledgeBaseId} not found`);
        }

        // Verifica se a base pertence ao usuário
        if (knowledgeBase.userId.toString() !== userId) {
            throw new NotFoundException(`Knowledge base with id ${knowledgeBaseId} not found`);
        }

        // Busca o arquivo do bucket
        const bucketFile = await this.bucketFileRepository.findById(bucketFileId);
        if (!bucketFile) {
            throw new NotFoundException(`File with id ${bucketFileId} not found`);
        }

        // Verifica se o arquivo pertence ao usuário e à base de conhecimento
        if (bucketFile.userId.toString() !== userId ||
            bucketFile.knowledgeBaseId?.toString() !== knowledgeBaseId) {
            throw new NotFoundException(`File with id ${bucketFileId} not found`);
        }

        // Verifica se a base já está em processamento
        if (knowledgeBase.status === 'processing') {
            this.logger.warn(`Knowledge base ${knowledgeBaseId} is already being processed`);
            return;
        }

        // Atualiza o status da base de conhecimento
        await this.knowledgeBaseRepository.update(knowledgeBaseId, {
            status: 'processing',
        });

        // Atualiza o status do arquivo
        await this.bucketFileRepository.update(bucketFileId, {
            status: 'processing' as FileStatus,
        });

        const message = {
            knowledgeBaseId,
            userId,
            bucketFileId,
            filename: bucketFile.fileName,
            action: 'process_document',
            priority: 'normal',
            timestamp: new Date().toISOString()
        }


        this.logger.debug(`[StartProcessUseCase] Enviando mensagem para processamento: ${JSON.stringify(message)}`);
        // Envia mensagem para processamento usando o exchange global
        await this.rabbitMQService.publish('knowledge.process', message);

        this.logger.log(`Process started for knowledge base ${knowledgeBaseId} and file ${bucketFileId}`);
    }
} 