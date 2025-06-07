import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { KnowledgeController } from "./knowledge.controller";
import { KnowledgeService } from "./knowledge.service";
import {
  KnowledgeBase,
  KnowledgeBaseSchema,
} from "./schemas/knowledge-base.schema";
import { AuthModule } from "../auth/auth.module";
import { DatasetModule } from '../dataset/dataset.module';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';
import { DomainKnowledgeService } from './domain/services/knowledge.service';
import { KnowledgeRepository } from './infrastructure/repositories/knowledge.repository';
import { IKnowledgeRepository } from './domain/interfaces/knowledge.repository.interface';
import { Knowledge, KnowledgeSchema } from './domain/entities/knowledge.entity';
import { KnowledgeBaseRepository } from './infrastructure/repositories/knowledge-base.repository';
import { IKnowledgeBaseRepository } from './domain/interfaces/knowledge-base.repository.interface';
import { StartProcessUseCase } from './application/use-cases/start-process/start-process.usecase';
import { IBucketFileRepository } from '../dataset/domain/repositories/bucket-file.repository';
import { BUCKET_FILE_REPOSITORY } from '../dataset/domain/constants/injection-tokens';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { PostgresDocumentEmbeddingRepository } from './infrastructure/repositories/postgres-document-embedding.repository';
import { IDocumentEmbeddingRepository } from './domain/entities/document-embedding.entity';
import { EmbeddingService } from './domain/services/embedding.service';
import { OpenAIEmbeddingService } from './domain/services/openai-embedding.service';

export const KNOWLEDGE_REPOSITORY = 'KNOWLEDGE_REPOSITORY';
export const KNOWLEDGE_BASE_REPOSITORY = 'KNOWLEDGE_BASE_REPOSITORY';
export const DOCUMENT_EMBEDDING_REPOSITORY = 'DOCUMENT_EMBEDDING_REPOSITORY';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: KnowledgeBase.name, schema: KnowledgeBaseSchema },
      { name: Knowledge.name, schema: KnowledgeSchema },
    ]),
    AuthModule,
    DatasetModule,
    RabbitMQModule
  ],
  controllers: [KnowledgeController],
  providers: [
    KnowledgeService,
    KnowledgeRepository,
    KnowledgeBaseRepository,
    PostgresDocumentEmbeddingRepository,
    OpenAIEmbeddingService,
    {
      provide: KNOWLEDGE_REPOSITORY,
      useClass: KnowledgeRepository,
    },
    {
      provide: KNOWLEDGE_BASE_REPOSITORY,
      useClass: KnowledgeBaseRepository,
    },
    {
      provide: DOCUMENT_EMBEDDING_REPOSITORY,
      useClass: PostgresDocumentEmbeddingRepository,
    },
    {
      provide: DomainKnowledgeService,
      useFactory: (repository: IKnowledgeRepository) => {
        return new DomainKnowledgeService(repository);
      },
      inject: [KNOWLEDGE_REPOSITORY],
    },
    {
      provide: StartProcessUseCase,
      useFactory: (
        repository: IKnowledgeBaseRepository,
        bucketFileRepository: IBucketFileRepository,
        rabbitMQService: RabbitMQService
      ) => {
        return new StartProcessUseCase(repository, bucketFileRepository, rabbitMQService);
      },
      inject: [KNOWLEDGE_BASE_REPOSITORY, BUCKET_FILE_REPOSITORY, RabbitMQService],
    },
    {
      provide: EmbeddingService,
      useFactory: (repository: IDocumentEmbeddingRepository) => {
        return new EmbeddingService(repository);
      },
      inject: [DOCUMENT_EMBEDDING_REPOSITORY],
    },
  ],
  exports: [KnowledgeService, DomainKnowledgeService, EmbeddingService],
})
export class KnowledgeModule { }
