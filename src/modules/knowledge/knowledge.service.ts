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
import { RabbitMQService } from "./infrastructure/services/rabbitmq.service";
import { StartProcessUseCase } from "./application/use-cases/start-process/start-process.usecase";
import { KnowledgeBaseStatus } from "./domain/enums/knowledge-base-status.enum";

@Injectable()
export class KnowledgeService {
    private readonly logger = new Logger(KnowledgeService.name);

    constructor(
        @InjectModel(KnowledgeBase.name)
        private knowledgeBaseModel: Model<KnowledgeBase>,
        private readonly datasetService: DatasetService,
        private readonly rabbitMQService: RabbitMQService,
        private readonly startProcessUseCase: StartProcessUseCase,
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
        console.log("createDto", createDto);
        const createdKnowledgeBase = new this.knowledgeBaseModel(createDto);
        const savedKnowledgeBase = await createdKnowledgeBase.save();

        const message = {
            knowledgeBaseId: savedKnowledgeBase._id,
            userId: savedKnowledgeBase.userId,
        };
        console.log("message", message);

        // Envia para a fila de processamento
        await this.rabbitMQService.sendMessage(message);

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
        const result = await this.knowledgeBaseModel
            .deleteOne({ _id: id, userId })
            .exec();
        if (result.deletedCount === 0) {
            throw new NotFoundException(`Knowledge base with ID ${id} not found`);
        }
    }

    async startProcess(id: string, userId: string, bucketFileId: string): Promise<KnowledgeBase> {
        await this.startProcessUseCase.execute(id, userId, bucketFileId);
        return this.getKnowledgeBaseById(id, userId);
    }
}
