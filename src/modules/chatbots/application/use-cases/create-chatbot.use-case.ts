import { Injectable, Logger, ConflictException } from '@nestjs/common';
import { Types } from 'mongoose';
import { Chatbot } from '../../domain/entities/chatbot.entity';
import { ChatbotService } from '../../domain/services/chatbot.service';
import { CreateChatbotDto } from '../dtos/chatbot.dtos';
import { BaseUseCase } from '../../../../core/domain/use-cases/base.use-case';

@Injectable()
export class CreateChatbotUseCase extends BaseUseCase<Chatbot> {
    private readonly logger = new Logger(CreateChatbotUseCase.name);

    constructor(
        private readonly chatbotService: ChatbotService,
    ) {
        super(chatbotService);
    }

    async execute(userId: string, dto: CreateChatbotDto): Promise<Chatbot> {
        this.logger.debug(`[CreateChatbot] Criando chatbot para usuário: ${userId}`);

        // Verifica se já existe um chatbot com o mesmo nome para este usuário
        const existingChatbot = await this.chatbotService.findByName(dto.name);
        if (existingChatbot) {
            this.logger.warn(`[CreateChatbot] Já existe um chatbot com o nome: ${dto.name}`);
            throw new ConflictException('Já existe um chatbot com este nome');
        }

        const chatbot = await this.chatbotService.create({
            ...dto,
            userId: new Types.ObjectId(userId),
            isActive: true,
        });

        this.logger.debug(`[CreateChatbot] Chatbot criado com sucesso: ${chatbot.id}`);
        return chatbot;
    }
} 