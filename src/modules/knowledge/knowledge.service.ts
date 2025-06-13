import {
    Injectable,
    NotFoundException,
    BadRequestException,
    Logger,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { KnowledgeBase } from "./schemas/knowledge-base.schema";
import { CreateKnowledgeBaseDto } from "./dto/create-knowledge-base.dto";
import { UpdateKnowledgeBaseDto } from "./dto/update-knowledge-base.dto";
import { DatasetService } from "../dataset/dataset.service";
import { RabbitMQService } from "../rabbitmq/rabbitmq.service";
import { StartProcessUseCase } from "./application/use-cases/start-process/start-process.usecase";
import { KnowledgeBaseStatus } from "./domain/enums/knowledge-base-status.enum";
import { EmbeddingService } from "./domain/services/embedding.service";

@Injectable()
export class KnowledgeService {
    private readonly logger = new Logger(KnowledgeService.name);

    constructor(
        @InjectModel(KnowledgeBase.name)
        private knowledgeBaseModel: Model<KnowledgeBase>,
        private readonly datasetService: DatasetService,
        private readonly rabbitMQService: RabbitMQService,
        private readonly startProcessUseCase: StartProcessUseCase,
        private readonly embeddingService: EmbeddingService,
    ) { }

    async createKnowledgeBase(
        userId: string,
        name: string,
        description: string,
    ): Promise<KnowledgeBase> {
        const createDto: CreateKnowledgeBaseDto = {
            userId,
            name,
            description,
            status: KnowledgeBaseStatus.NEW,
        };
        this.logger.log("Criando base de conhecimento:", createDto);
        const createdKnowledgeBase = new this.knowledgeBaseModel(createDto);
        const savedKnowledgeBase = await createdKnowledgeBase.save();

        const message = {
            knowledgeBaseId: savedKnowledgeBase._id,
            userId: savedKnowledgeBase.userId,
            action: 'create_knowledge_base',
            priority: 'normal',
            timestamp: new Date().toISOString()
        };
        this.logger.log("Enviando mensagem para processamento:", message);

        // Envia para a fila de processamento usando o exchange global
        await this.rabbitMQService.publish('knowledge.process', message);

        return savedKnowledgeBase;
    }

    async listUserKnowledgeBases(userId: string): Promise<KnowledgeBase[]> {
        return this.knowledgeBaseModel.find({ userId }).exec();
    }

    async getKnowledgeBaseById(
        id: string,
        userId: string,
    ): Promise<KnowledgeBase> {
        const knowledgeBase = await this.knowledgeBaseModel
            .findOne({ _id: id, userId })
            .exec();
        if (!knowledgeBase) {
            throw new NotFoundException(`Knowledge base with ID ${id} not found`);
        }
        return knowledgeBase;
    }

    async update(
        id: string,
        updateKnowledgeBaseDto: UpdateKnowledgeBaseDto,
    ): Promise<KnowledgeBase> {
        const updatedKnowledgeBase = await this.knowledgeBaseModel
            .findByIdAndUpdate(id, updateKnowledgeBaseDto, { new: true })
            .exec();
        if (!updatedKnowledgeBase) {
            throw new NotFoundException(`Knowledge base with ID ${id} not found`);
        }
        return updatedKnowledgeBase;
    }

    async deleteKnowledgeBase(id: string, userId: string): Promise<void> {
        // Primeiro verifica se a base existe e pertence ao usuário
        const knowledgeBase = await this.getKnowledgeBaseById(id, userId);

        // Deleta todos os chunks associados à base
        await this.embeddingService.deleteByKnowledgeBaseId(id);

        // Deleta a base de conhecimento
        const result = await this.knowledgeBaseModel
            .deleteOne({ _id: id, userId })
            .exec();

        if (result.deletedCount === 0) {
            throw new NotFoundException(`Knowledge base with ID ${id} not found`);
        }

        this.logger.log(`Base de conhecimento ${id} e seus chunks foram excluídos com sucesso`);
    }

    async startProcess(id: string, userId: string, bucketFileId: string): Promise<KnowledgeBase> {
        await this.startProcessUseCase.execute(id, userId, bucketFileId);
        return this.getKnowledgeBaseById(id, userId);
    }
}
