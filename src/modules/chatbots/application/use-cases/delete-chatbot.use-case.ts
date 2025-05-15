import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IChatbotRepository } from '../../domain/repositories/chatbot.repository.interface';
import { CHATBOT_REPOSITORY } from '../../domain/tokens/injection.tokens';

@Injectable()
export class DeleteChatbotUseCase {
    constructor(
        @Inject(CHATBOT_REPOSITORY)
        private readonly chatbotRepository: IChatbotRepository
    ) { }

    async execute(userId: string, id: string): Promise<void> {
        const existingChatbot = await this.chatbotRepository.findById(id);

        if (!existingChatbot) {
            throw new NotFoundException(`Chatbot with ID ${id} not found`);
        }

        if (existingChatbot.userId.toString() !== userId) {
            throw new NotFoundException(`Chatbot with ID ${id} not found`);
        }

        await this.chatbotRepository.delete(id);
    }
} 