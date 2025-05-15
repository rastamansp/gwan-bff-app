import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IChatbotRepository } from '../../domain/repositories/chatbot.repository.interface';
import { UpdateVectorConfigDto, ChatbotResponseDto } from '../../domain/dtos/chatbot.dtos';
import { Chatbot } from '../../domain/entities/chatbot.entity';
import { CHATBOT_REPOSITORY } from '../../domain/tokens/injection.tokens';

@Injectable()
export class UpdateVectorConfigUseCase {
    constructor(
        @Inject(CHATBOT_REPOSITORY)
        private readonly chatbotRepository: IChatbotRepository
    ) { }

    async execute(userId: string, id: string, dto: UpdateVectorConfigDto): Promise<ChatbotResponseDto> {
        const existingChatbot = await this.chatbotRepository.findById(id);

        if (!existingChatbot) {
            throw new NotFoundException(`Chatbot with ID ${id} not found`);
        }

        if (existingChatbot.userId.toString() !== userId) {
            throw new NotFoundException(`Chatbot with ID ${id} not found`);
        }

        const updatedChatbot = await this.chatbotRepository.updateVectorConfig(id, {
            ...dto,
            updatedAt: new Date(),
        });

        return this.mapToResponseDto(updatedChatbot);
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