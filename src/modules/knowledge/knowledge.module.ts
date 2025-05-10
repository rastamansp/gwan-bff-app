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

export const KNOWLEDGE_REPOSITORY = 'KNOWLEDGE_REPOSITORY';

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
    {
      provide: KNOWLEDGE_REPOSITORY,
      useClass: KnowledgeRepository,
    },
    {
      provide: DomainKnowledgeService,
      useFactory: (repository: IKnowledgeRepository) => {
        return new DomainKnowledgeService(repository);
      },
      inject: [KNOWLEDGE_REPOSITORY],
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
