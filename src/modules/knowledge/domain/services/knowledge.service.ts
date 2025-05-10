import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IKnowledgeService } from '../interfaces/knowledge.service.interface';
import { Knowledge, KnowledgeDocument } from '../entities/knowledge.entity';
import { IKnowledgeRepository } from '../interfaces/knowledge.repository.interface';
import { CreateKnowledgeDto } from '../dtos/create-knowledge.dto';
import { UpdateKnowledgeDto } from '../dtos/update-knowledge.dto';
import { KnowledgeResponseDto } from '../dtos/knowledge-response.dto';
import { KnowledgeMapper } from '../mappers/knowledge.mapper';
import { KNOWLEDGE_REPOSITORY } from '../../knowledge.module';

@Injectable()
export class DomainKnowledgeService implements IKnowledgeService {
    constructor(
        @Inject(KNOWLEDGE_REPOSITORY)
        private readonly knowledgeRepository: IKnowledgeRepository,
    ) { }

    async findByAuthorId(authorId: string): Promise<KnowledgeResponseDto[]> {
        const knowledges = await this.knowledgeRepository.findByAuthorId(authorId);
        return knowledges.map(KnowledgeMapper.toResponseDto);
    }

    async findByCategory(category: string): Promise<KnowledgeResponseDto[]> {
        const knowledges = await this.knowledgeRepository.findByCategory(category);
        return knowledges.map(KnowledgeMapper.toResponseDto);
    }

    async findByTags(tags: string[]): Promise<KnowledgeResponseDto[]> {
        const knowledges = await this.knowledgeRepository.findByTags(tags);
        return knowledges.map(KnowledgeMapper.toResponseDto);
    }

    async findById(id: string): Promise<KnowledgeResponseDto> {
        const knowledge = await this.knowledgeRepository.findById(id);
        if (!knowledge) {
            throw new NotFoundException(`Knowledge with ID ${id} not found`);
        }
        return KnowledgeMapper.toResponseDto(knowledge);
    }

    async findAll(): Promise<KnowledgeResponseDto[]> {
        const knowledges = await this.knowledgeRepository.findAll();
        return knowledges.map(KnowledgeMapper.toResponseDto);
    }

    async create(createKnowledgeDto: CreateKnowledgeDto): Promise<KnowledgeResponseDto> {
        const knowledge = await this.knowledgeRepository.create(createKnowledgeDto);
        return KnowledgeMapper.toResponseDto(knowledge);
    }

    async update(id: string, updateKnowledgeDto: UpdateKnowledgeDto): Promise<KnowledgeResponseDto> {
        const knowledge = await this.knowledgeRepository.update(id, updateKnowledgeDto);
        if (!knowledge) {
            throw new NotFoundException(`Knowledge with ID ${id} not found`);
        }
        return KnowledgeMapper.toResponseDto(knowledge);
    }

    async delete(id: string): Promise<void> {
        const knowledge = await this.knowledgeRepository.findById(id);
        if (!knowledge) {
            throw new NotFoundException(`Knowledge with ID ${id} not found`);
        }
        await this.knowledgeRepository.delete(id);
    }
} 