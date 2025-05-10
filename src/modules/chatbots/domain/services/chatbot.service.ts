import { Injectable, Logger, Inject } from '@nestjs/common';
import { BaseService } from '../../../../core/domain/services/base.service';
import { Chatbot } from '../entities/chatbot.entity';
import { IChatbotRepository } from '../repositories/chatbot.repository.interface';

@Injectable()
export class ChatbotService extends BaseService<Chatbot> {
    private readonly logger = new Logger(ChatbotService.name);

    constructor(
        @Inject('IChatbotRepository')
        private readonly chatbotRepository: IChatbotRepository,
    ) {
        super(chatbotRepository);
    }

    async findByUserId(userId: string): Promise<Chatbot[]> {
        this.logger.debug(`[FindByUserId] Buscando chatbots do usuário: ${userId}`);
        return this.chatbotRepository.findByUserId(userId);
    }

    async findByName(name: string): Promise<Chatbot | null> {
        this.logger.debug(`[FindByName] Buscando chatbot por nome: ${name}`);
        return this.chatbotRepository.findByName(name);
    }

    async findByN8nId(n8nId: string): Promise<Chatbot | null> {
        this.logger.debug(`[FindByN8nId] Buscando chatbot por n8nId: ${n8nId}`);
        return this.chatbotRepository.findByN8nId(n8nId);
    }

    async updateStatus(id: string, isActive: boolean): Promise<Chatbot> {
        this.logger.debug(`[UpdateStatus] Atualizando status do chatbot: ${id}`);
        return this.chatbotRepository.updateStatus(id, isActive);
    }

    async updateN8nConfig(id: string, n8nConfig: Partial<Chatbot>): Promise<Chatbot> {
        this.logger.debug(`[UpdateN8nConfig] Atualizando configuração n8n do chatbot: ${id}`);
        return this.chatbotRepository.updateN8nConfig(id, n8nConfig);
    }

    async updateVectorConfig(id: string, vectorConfig: Partial<Chatbot>): Promise<Chatbot> {
        this.logger.debug(`[UpdateVectorConfig] Atualizando configuração de vetor do chatbot: ${id}`);
        return this.chatbotRepository.updateVectorConfig(id, vectorConfig);
    }
} 