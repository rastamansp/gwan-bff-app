import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatbotController } from './presentation/controllers/chatbot.controller';
import { CreateChatbotUseCase } from './application/use-cases/create-chatbot.use-case';
import { ListChatbotsUseCase } from './application/use-cases/list-chatbots.use-case';
import { UpdateChatbotUseCase } from './application/use-cases/update-chatbot.use-case';
import { DeleteChatbotUseCase } from './application/use-cases/delete-chatbot.use-case';
import { UpdateN8nConfigUseCase } from './application/use-cases/update-n8n-config.use-case';
import { UpdateVectorConfigUseCase } from './application/use-cases/update-vector-config.use-case';
import { UpdateStatusUseCase } from './application/use-cases/update-status.use-case';
import { MongoDBChatbotRepository } from './infrastructure/repositories/mongodb-chatbot.repository';
import { CHATBOT_REPOSITORY } from './domain/tokens/injection.tokens';
import { ChatbotSchema, ChatbotSchemaFactory } from './infrastructure/schemas/chatbot.schema';
import { ChatbotService } from './domain/services/chatbot.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Chatbot', schema: ChatbotSchemaFactory },
        ]),
    ],
    controllers: [ChatbotController],
    providers: [
        ChatbotService,
        CreateChatbotUseCase,
        ListChatbotsUseCase,
        UpdateChatbotUseCase,
        DeleteChatbotUseCase,
        UpdateN8nConfigUseCase,
        UpdateVectorConfigUseCase,
        UpdateStatusUseCase,
        {
            provide: CHATBOT_REPOSITORY,
            useClass: MongoDBChatbotRepository,
        },
    ],
    exports: [CHATBOT_REPOSITORY],
})
export class ChatbotsModule { } 