import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { KnowledgeController } from "./knowledge.controller";
import { KnowledgeService } from "./knowledge.service";
import {
  KnowledgeBase,
  KnowledgeBaseSchema,
} from "./schemas/knowledge-base.schema";
import { AuthModule } from "../auth/auth.module";
import { RabbitMQService } from "./infrastructure/services/rabbitmq.service";
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

export const KNOWLEDGE_REPOSITORY = 'KNOWLEDGE_REPOSITORY';
export const KNOWLEDGE_BASE_REPOSITORY = 'KNOWLEDGE_BASE_REPOSITORY';

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
    RabbitMQService,
    KnowledgeRepository,
    KnowledgeBaseRepository,
    {
      provide: KNOWLEDGE_REPOSITORY,
      useClass: KnowledgeRepository,
    },
    {
      provide: KNOWLEDGE_BASE_REPOSITORY,
      useClass: KnowledgeBaseRepository,
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
  ],
  exports: [KnowledgeService, DomainKnowledgeService],
})
export class KnowledgeModule {
  constructor(private readonly rabbitMQService: RabbitMQService) { }

  async onModuleInit() {
    // Inicializa a conexão com o RabbitMQ quando o módulo é carregado
    await this.rabbitMQService.init();
  }

  async onModuleDestroy() {
    // Fecha a conexão com o RabbitMQ quando o módulo é destruído
    await this.rabbitMQService.closeConnection();
  }
}
