import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Chatbot, ChatbotDocument } from '../../domain/entities/chatbot.entity';
import { IChatbotRepository } from '../../domain/repositories/chatbot.repository.interface';
import { BaseMongoRepository } from '../../../../core/infrastructure/repositories/base-mongo.repository';

@Injectable()
export class MongooseChatbotRepository extends BaseMongoRepository<ChatbotDocument> implements IChatbotRepository {
    constructor(
        @InjectModel(Chatbot.name)
        private readonly chatbotModel: Model<ChatbotDocument>,
    ) {
        super(chatbotModel);
    }

    async findByUserId(userId: string): Promise<Chatbot[]> {
        const chatbots = await this.chatbotModel.find({ userId: new Types.ObjectId(userId) }).exec();
        return chatbots.map(chatbot => this.transformChatbot(chatbot));
    }

    async findByName(name: string): Promise<Chatbot | null> {
        const chatbot = await this.chatbotModel.findOne({ name }).exec();
        return this.transformChatbot(chatbot);
    }

    async findByN8nId(n8nId: string): Promise<Chatbot | null> {
        const chatbot = await this.chatbotModel.findOne({ n8nId }).exec();
        return this.transformChatbot(chatbot);
    }

    async updateStatus(id: string, isActive: boolean): Promise<Chatbot> {
        const chatbot = await this.chatbotModel
            .findByIdAndUpdate(id, { isActive }, { new: true })
            .exec();
        return this.transformChatbot(chatbot);
    }

    async updateN8nConfig(id: string, n8nConfig: Partial<Chatbot>): Promise<Chatbot> {
        const chatbot = await this.chatbotModel
            .findByIdAndUpdate(id, { $set: n8nConfig }, { new: true })
            .exec();
        return this.transformChatbot(chatbot);
    }

    async updateVectorConfig(id: string, vectorConfig: Partial<Chatbot>): Promise<Chatbot> {
        const chatbot = await this.chatbotModel
            .findByIdAndUpdate(id, { $set: vectorConfig }, { new: true })
            .exec();
        return this.transformChatbot(chatbot);
    }

    private transformChatbot(chatbot: ChatbotDocument | null): Chatbot | null {
        if (!chatbot) return null;
        const chatbotObject = chatbot.toObject();
        return {
            ...chatbotObject,
            id: chatbotObject._id.toString(),
            userId: chatbotObject.userId.toString(),
            _id: undefined
        };
    }
} 