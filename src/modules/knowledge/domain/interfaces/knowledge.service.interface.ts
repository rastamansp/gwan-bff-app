import { KnowledgeResponseDto } from '../dtos/knowledge-response.dto';
import { CreateKnowledgeDto } from '../dtos/create-knowledge.dto';
import { UpdateKnowledgeDto } from '../dtos/update-knowledge.dto';

export interface IKnowledgeService {
    findByAuthorId(authorId: string): Promise<KnowledgeResponseDto[]>;
    findByCategory(category: string): Promise<KnowledgeResponseDto[]>;
    findByTags(tags: string[]): Promise<KnowledgeResponseDto[]>;
    findById(id: string): Promise<KnowledgeResponseDto>;
    findAll(): Promise<KnowledgeResponseDto[]>;
    create(createKnowledgeDto: CreateKnowledgeDto): Promise<KnowledgeResponseDto>;
    update(id: string, updateKnowledgeDto: UpdateKnowledgeDto): Promise<KnowledgeResponseDto>;
    delete(id: string): Promise<void>;
} 