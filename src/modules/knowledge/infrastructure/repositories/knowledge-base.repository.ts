import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../../../core/infrastructure/repositories/base.repository';
import { IKnowledgeBaseRepository } from '../../domain/interfaces/knowledge-base.repository.interface';
import { KnowledgeBase } from '../../schemas/knowledge-base.schema';

@Injectable()
export class KnowledgeBaseRepository extends BaseRepository<KnowledgeBase> implements IKnowledgeBaseRepository {
    constructor(
        @InjectModel(KnowledgeBase.name)
        private readonly knowledgeBaseModel: Model<KnowledgeBase>,
    ) {
        super(knowledgeBaseModel);
    }

    async findByUserId(userId: string): Promise<KnowledgeBase[]> {
        return this.knowledgeBaseModel.find({ userId }).exec();
    }

    async findByIdAndUserId(id: string, userId: string): Promise<KnowledgeBase | null> {
        return this.knowledgeBaseModel.findOne({ _id: id, userId }).exec();
    }

    async updateStatus(id: string, status: 'new' | 'processing' | 'completed' | 'failed', error?: string): Promise<KnowledgeBase> {
        const updateData: any = { status };
        if (error) {
            updateData.error = error;
        }
        return this.knowledgeBaseModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }
} 