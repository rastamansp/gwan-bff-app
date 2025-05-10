import { Injectable } from '@nestjs/common';
import { IKnowledgeService } from '../../../domain/interfaces/knowledge.service.interface';
import { KnowledgeResponseDto } from '../../../domain/dtos/knowledge-response.dto';

@Injectable()
export class FindKnowledgeUseCase {
    constructor(private readonly knowledgeService: IKnowledgeService) { }

    async findById(id: string): Promise<KnowledgeResponseDto> {
        return this.knowledgeService.findById(id);
    }

    async findByCategory(category: string): Promise<KnowledgeResponseDto[]> {
        return this.knowledgeService.findByCategory(category);
    }

    async findByAuthorId(authorId: string): Promise<KnowledgeResponseDto[]> {
        return this.knowledgeService.findByAuthorId(authorId);
    }

    async findByTags(tags: string[]): Promise<KnowledgeResponseDto[]> {
        return this.knowledgeService.findByTags(tags);
    }

    async findAll(): Promise<KnowledgeResponseDto[]> {
        return this.knowledgeService.findAll();
    }

    async execute(authorId: string): Promise<KnowledgeResponseDto[]> {
        return this.knowledgeService.findByAuthorId(authorId);
    }
} 