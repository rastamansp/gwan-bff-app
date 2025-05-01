import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { KnowledgeBase } from './schemas/knowledge-base.schema';
import { CreateKnowledgeBaseDto } from './dto/create-knowledge-base.dto';
import { UpdateKnowledgeBaseDto } from './dto/update-knowledge-base.dto';
import { DatasetService } from '@knowledge/infrastructure/services/dataset.service';
import { RabbitMQService } from './infrastructure/services/rabbitmq.service';

@Injectable()
export class KnowledgeService {
    constructor(
        @InjectModel(KnowledgeBase.name) private knowledgeBaseModel: Model<KnowledgeBase>,
        private readonly datasetService: DatasetService,
        private readonly rabbitMQService: RabbitMQService
    ) { }

    async createKnowledgeBase(
        userId: string,
        fileId: string,
        name: string,
        description: string
    ): Promise<KnowledgeBase> {
        const createDto: CreateKnowledgeBaseDto = {
            userId,
            fileId,
            name,
            description,
            status: 'processing'
        };
        console.log('createDto', createDto);
        const createdKnowledgeBase = new this.knowledgeBaseModel(createDto);
        const savedKnowledgeBase = await createdKnowledgeBase.save();

        // Envia para a fila de processamento
        await this.rabbitMQService.sendMessage({
            knowledgeBaseId: savedKnowledgeBase._id,
            fileId: savedKnowledgeBase.fileId,
            userId: savedKnowledgeBase.userId
        });

        return savedKnowledgeBase;
    }

    async listUserKnowledgeBases(userId: string): Promise<KnowledgeBase[]> {
        return this.knowledgeBaseModel.find({ userId }).exec();
    }

    async getKnowledgeBaseById(id: string, userId: string): Promise<KnowledgeBase> {
        const knowledgeBase = await this.knowledgeBaseModel.findOne({ _id: id, userId }).exec();
        if (!knowledgeBase) {
            throw new NotFoundException(`Knowledge base with ID ${id} not found`);
        }
        return knowledgeBase;
    }

    async update(id: string, updateKnowledgeBaseDto: UpdateKnowledgeBaseDto): Promise<KnowledgeBase> {
        const updatedKnowledgeBase = await this.knowledgeBaseModel
            .findByIdAndUpdate(id, updateKnowledgeBaseDto, { new: true })
            .exec();
        if (!updatedKnowledgeBase) {
            throw new NotFoundException(`Knowledge base with ID ${id} not found`);
        }
        return updatedKnowledgeBase;
    }

    async deleteKnowledgeBase(id: string, userId: string): Promise<void> {
        const result = await this.knowledgeBaseModel.deleteOne({ _id: id, userId }).exec();
        if (result.deletedCount === 0) {
            throw new NotFoundException(`Knowledge base with ID ${id} not found`);
        }
    }
} 