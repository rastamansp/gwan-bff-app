import { Injectable } from '@nestjs/common';
import { IKnowledgeService } from '../../../domain/interfaces/knowledge.service.interface';
import { UpdateKnowledgeDto } from '../../../domain/dtos/update-knowledge.dto';
import { KnowledgeResponseDto } from '../../../domain/dtos/knowledge-response.dto';

@Injectable()
export class UpdateKnowledgeUseCase {
    constructor(
        private readonly knowledgeService: IKnowledgeService,
    ) { }

    async execute(id: string, data: UpdateKnowledgeDto): Promise<KnowledgeResponseDto> {
        return this.knowledgeService.update(id, data);
    }
} 