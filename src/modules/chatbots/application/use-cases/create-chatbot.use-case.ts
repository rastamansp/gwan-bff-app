import { Injectable, Logger, ConflictException, Inject } from '@nestjs/common';
import { Types } from 'mongoose';
import { Chatbot } from '../../domain/entities/chatbot.entity';
import { ChatbotService } from '../../domain/services/chatbot.service';
import { CreateChatbotDto, ChatbotResponseDto } from '../../domain/dtos/chatbot.dtos';
import { BaseUseCase } from '../../../../core/domain/use-cases/base.use-case';
import { IChatbotRepository } from '../../domain/repositories/chatbot.repository.interface';
import { CHATBOT_REPOSITORY } from '../../domain/tokens/injection.tokens';

@Injectable()
export class CreateChatbotUseCase extends BaseUseCase<Chatbot> {
    private readonly logger = new Logger(CreateChatbotUseCase.name);

    constructor(
        private readonly chatbotService: ChatbotService,
        @Inject(CHATBOT_REPOSITORY)
        private readonly chatbotRepository: IChatbotRepository
    ) {
        super(chatbotService);
    }

    async execute(userId: string, dto: CreateChatbotDto): Promise<ChatbotResponseDto> {
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
        return this.mapToResponseDto(chatbot);
    }

    private mapToResponseDto(chatbot: Chatbot): ChatbotResponseDto {
        return {
            id: chatbot.id,
            name: chatbot.name,
            description: chatbot.description,
            systemPrompt: chatbot.systemPrompt,
            aiModel: chatbot.aiModel,
            contentWindowSize: chatbot.contentWindowSize,
            n8nId: chatbot.n8nId,
            n8nWorkflowId: chatbot.n8nWorkflowId,
            n8nChatUrl: chatbot.n8nChatUrl,
            n8nChatRequireButtonClicktoStart: chatbot.n8nChatRequireButtonClicktoStart,
            n8nChatTitle: chatbot.n8nChatTitle,
            n8nChatSubtitle: chatbot.n8nChatSubtitle,
            n8nChatInitialMessage: chatbot.n8nChatInitialMessage,
            dataVector: chatbot.dataVector,
            dataVectorSize: chatbot.dataVectorSize,
            dataVectorIndex: chatbot.dataVectorIndex,
            dataVectorNamespace: chatbot.dataVectorNamespace,
            dataVectorModel: chatbot.dataVectorModel,
            dataVectorEmbeddingsModel: chatbot.dataVectorEmbeddingsModel,
            isActive: chatbot.isActive,
            userId: chatbot.userId.toString(),
            createdAt: chatbot.createdAt,
            updatedAt: chatbot.updatedAt,
        };
    }
} 