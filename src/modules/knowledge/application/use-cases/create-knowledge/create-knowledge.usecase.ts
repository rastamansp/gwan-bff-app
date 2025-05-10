import { Injectable } from '@nestjs/common';
import { IKnowledgeService } from '../../../domain/interfaces/knowledge.service.interface';
import { CreateKnowledgeDto } from '../../../domain/dtos/create-knowledge.dto';
import { KnowledgeResponseDto } from '../../../domain/dtos/knowledge-response.dto';

@Injectable()
export class CreateKnowledgeUseCase {
    constructor(
        private readonly knowledgeService: IKnowledgeService,
    ) { }

    async execute(data: CreateKnowledgeDto, authorId: string): Promise<KnowledgeResponseDto> {
        const knowledgeData = { ...data, authorId };
        return this.knowledgeService.create(knowledgeData);
    }
} 