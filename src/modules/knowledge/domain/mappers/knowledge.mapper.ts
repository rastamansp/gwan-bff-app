import { Knowledge } from '../entities/knowledge.entity';
import { CreateKnowledgeDto } from '../dtos/create-knowledge.dto';
import { UpdateKnowledgeDto } from '../dtos/update-knowledge.dto';
import { KnowledgeResponseDto } from '../dtos/knowledge-response.dto';

export class KnowledgeMapper {
    static toEntity(createKnowledgeDto: CreateKnowledgeDto, authorId: string): Partial<Knowledge> {
        return {
            title: createKnowledgeDto.title,
            content: createKnowledgeDto.content,
            category: createKnowledgeDto.category,
            tags: createKnowledgeDto.tags || [],
            authorId,
        };
    }

    static toUpdateEntity(updateKnowledgeDto: UpdateKnowledgeDto): Partial<Knowledge> {
        const updateData: Partial<Knowledge> = {};

        if (updateKnowledgeDto.title) updateData.title = updateKnowledgeDto.title;
        if (updateKnowledgeDto.content) updateData.content = updateKnowledgeDto.content;
        if (updateKnowledgeDto.category) updateData.category = updateKnowledgeDto.category;
        if (updateKnowledgeDto.tags) updateData.tags = updateKnowledgeDto.tags;

        return updateData;
    }

    static toResponseDto(knowledge: Knowledge): KnowledgeResponseDto {
        return {
            id: knowledge.id,
            title: knowledge.title,
            content: knowledge.content,
            category: knowledge.category,
            tags: knowledge.tags,
            authorId: knowledge.authorId,
            createdAt: knowledge.createdAt,
            updatedAt: knowledge.updatedAt,
        };
    }
} 