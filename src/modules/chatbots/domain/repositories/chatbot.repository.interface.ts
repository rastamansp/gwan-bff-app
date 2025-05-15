import { Chatbot } from '../entities/chatbot.entity';
import { IBaseRepository } from '../../../../core/domain/repositories/base.repository.interface';

export interface IChatbotRepository extends IBaseRepository<Chatbot> {
    findByUserId(userId: string): Promise<Chatbot[]>;
    findByName(name: string): Promise<Chatbot | null>;
    findByN8nId(n8nId: string): Promise<Chatbot | null>;
    updateStatus(id: string, isActive: boolean): Promise<Chatbot>;
    updateN8nConfig(id: string, n8nConfig: Partial<Chatbot>): Promise<Chatbot>;
    updateVectorConfig(id: string, vectorConfig: Partial<Chatbot>): Promise<Chatbot>;
    list(page: number, limit: number): Promise<{ data: Chatbot[]; total: number }>;
} 