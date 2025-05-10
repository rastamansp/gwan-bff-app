import { Model, Document } from 'mongoose';
import { IRepository } from '../../domain/interfaces/repository.interface';

export abstract class BaseRepository<T extends Document> implements IRepository<T> {
    constructor(protected readonly model: Model<T>) { }

    async findById(id: string): Promise<T | null> {
        return this.model.findById(id).exec();
    }

    async findAll(): Promise<T[]> {
        return this.model.find().exec();
    }

    async create(data: Partial<T>): Promise<T> {
        const entity = new this.model(data);
        return entity.save();
    }

    async update(id: string, data: Partial<T>): Promise<T> {
        return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async delete(id: string): Promise<void> {
        await this.model.findByIdAndDelete(id).exec();
    }
} 