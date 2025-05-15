import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IChatbotRepository } from '../../domain/repositories/chatbot.repository.interface';
import { Chatbot } from '../../domain/entities/chatbot.entity';
import { ChatbotSchema } from '../schemas/chatbot.schema';

@Injectable()
export class MongoDBChatbotRepository implements IChatbotRepository {
    constructor(
        @InjectModel('Chatbot') private readonly chatbotModel: Model<ChatbotSchema>
    ) { }

    async findAll(): Promise<Chatbot[]> {
        const chatbots = await this.chatbotModel.find().exec();
        return chatbots.map(this.mapToEntity);
    }

    async create(chatbot: Partial<Chatbot>): Promise<Chatbot> {
        const createdChatbot = new this.chatbotModel(chatbot);
        const savedChatbot = await createdChatbot.save();
        return this.mapToEntity(savedChatbot);
    }

    async findById(id: string): Promise<Chatbot | null> {
        const chatbot = await this.chatbotModel.findById(id).exec();
        return chatbot ? this.mapToEntity(chatbot) : null;
    }

    async findByUserId(userId: string): Promise<Chatbot[]> {
        const chatbots = await this.chatbotModel.find({ userId }).exec();
        return chatbots.map(this.mapToEntity);
    }

    async findByName(name: string): Promise<Chatbot | null> {
        const chatbot = await this.chatbotModel.findOne({ name }).exec();
        return chatbot ? this.mapToEntity(chatbot) : null;
    }

    async findByN8nId(n8nId: string): Promise<Chatbot | null> {
        const chatbot = await this.chatbotModel.findOne({ n8nId }).exec();
        return chatbot ? this.mapToEntity(chatbot) : null;
    }

    async update(id: string, chatbot: Partial<Chatbot>): Promise<Chatbot | null> {
        const updatedChatbot = await this.chatbotModel
            .findByIdAndUpdate(id, chatbot, { new: true })
            .exec();
        return updatedChatbot ? this.mapToEntity(updatedChatbot) : null;
    }

    async updateStatus(id: string, isActive: boolean): Promise<Chatbot> {
        const updatedChatbot = await this.chatbotModel
            .findByIdAndUpdate(id, { isActive }, { new: true })
            .exec();
        if (!updatedChatbot) {
            throw new Error(`Chatbot with ID ${id} not found`);
        }
        return this.mapToEntity(updatedChatbot);
    }

    async updateN8nConfig(id: string, n8nConfig: Partial<Chatbot>): Promise<Chatbot> {
        const updatedChatbot = await this.chatbotModel
            .findByIdAndUpdate(id, n8nConfig, { new: true })
            .exec();
        if (!updatedChatbot) {
            throw new Error(`Chatbot with ID ${id} not found`);
        }
        return this.mapToEntity(updatedChatbot);
    }

    async updateVectorConfig(id: string, vectorConfig: Partial<Chatbot>): Promise<Chatbot> {
        const updatedChatbot = await this.chatbotModel
            .findByIdAndUpdate(id, vectorConfig, { new: true })
            .exec();
        if (!updatedChatbot) {
            throw new Error(`Chatbot with ID ${id} not found`);
        }
        return this.mapToEntity(updatedChatbot);
    }

    async delete(id: string): Promise<void> {
        await this.chatbotModel.deleteOne({ _id: id }).exec();
    }

    async list(page: number, limit: number): Promise<{ data: Chatbot[]; total: number }> {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.chatbotModel.find().skip(skip).limit(limit).exec(),
            this.chatbotModel.countDocuments().exec(),
        ]);

        return {
            data: data.map(this.mapToEntity),
            total,
        };
    }

    private mapToEntity(doc: any): Chatbot {
        const { _id, ...rest } = doc.toObject();
        return new Chatbot({
            id: _id.toString(),
            ...rest,
        });
    }
} 