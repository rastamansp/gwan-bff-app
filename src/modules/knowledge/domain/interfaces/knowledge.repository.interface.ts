import { IRepository } from '../../../../core/domain/interfaces/repository.interface';
import { Knowledge, KnowledgeDocument } from '../entities/knowledge.entity';

export interface IKnowledgeRepository extends IRepository<KnowledgeDocument> {
    findByAuthorId(authorId: string): Promise<KnowledgeDocument[]>;
    findByCategory(category: string): Promise<KnowledgeDocument[]>;
    findByTags(tags: string[]): Promise<KnowledgeDocument[]>;
} 