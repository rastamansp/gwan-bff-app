import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { KnowledgeController } from "./knowledge.controller";
import { KnowledgeService } from "./knowledge.service";
import {
  KnowledgeBase,
  KnowledgeBaseSchema,
} from "./schemas/knowledge-base.schema";
import { AuthModule } from "../auth/auth.module";
import { DatasetService } from "./infrastructure/services/dataset.service";
import { RabbitMQService } from "./infrastructure/services/rabbitmq.service";
import { DatasetModule } from '../dataset/dataset.module';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: KnowledgeBase.name, schema: KnowledgeBaseSchema },
    ]),
    AuthModule,
    DatasetModule,
    RabbitMQModule
  ],
  controllers: [KnowledgeController],
  providers: [KnowledgeService, DatasetService, RabbitMQService],
  exports: [KnowledgeService, DatasetService],
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
