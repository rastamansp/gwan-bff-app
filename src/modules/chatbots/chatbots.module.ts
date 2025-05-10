import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chatbot, ChatbotSchema } from './domain/entities/chatbot.entity';
import { ChatbotController } from './presentation/controllers/chatbot.controller';
import { ChatbotService } from './domain/services/chatbot.service';
import { CreateChatbotUseCase } from './application/use-cases/create-chatbot.use-case';
import { MongooseChatbotRepository } from './infrastructure/repositories/mongodb-chatbot.repository';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Chatbot.name, schema: ChatbotSchema }
        ]),
    ],
    controllers: [ChatbotController],
    providers: [
        ChatbotService,
        CreateChatbotUseCase,
        {
            provide: 'IChatbotRepository',
            useClass: MongooseChatbotRepository,
        },
    ],
    exports: [ChatbotService],
})
export class ChatbotsModule { } 