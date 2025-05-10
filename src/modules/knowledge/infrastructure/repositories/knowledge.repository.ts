import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../../../core/infrastructure/repositories/base.repository';
import { IKnowledgeRepository } from '../../domain/interfaces/knowledge.repository.interface';
import { Knowledge, KnowledgeDocument } from '../../domain/entities/knowledge.entity';

@Injectable()
export class KnowledgeRepository extends BaseRepository<KnowledgeDocument> implements IKnowledgeRepository {
    constructor(
        @InjectModel(Knowledge.name)
        private readonly knowledgeModel: Model<KnowledgeDocument>,
    ) {
        super(knowledgeModel);
    }

    async findByAuthorId(authorId: string): Promise<KnowledgeDocument[]> {
        return this.knowledgeModel.find({ authorId }).exec();
    }

    async findByCategory(category: string): Promise<KnowledgeDocument[]> {
        return this.knowledgeModel.find({ category }).exec();
    }

    async findByTags(tags: string[]): Promise<KnowledgeDocument[]> {
        return this.knowledgeModel.find({ tags: { $in: tags } }).exec();
    }
} 