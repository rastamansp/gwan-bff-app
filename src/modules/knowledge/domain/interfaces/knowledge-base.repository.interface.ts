import { IRepository } from '../../../../core/domain/interfaces/repository.interface';
import { KnowledgeBase } from '../../schemas/knowledge-base.schema';

export interface IKnowledgeBaseRepository extends IRepository<KnowledgeBase> {
    findByUserId(userId: string): Promise<KnowledgeBase[]>;
    findByIdAndUserId(id: string, userId: string): Promise<KnowledgeBase | null>;
    updateStatus(id: string, status: 'new' | 'processing' | 'completed' | 'failed', error?: string): Promise<KnowledgeBase>;
} 