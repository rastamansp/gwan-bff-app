import { Model } from 'mongoose';
import { IBaseRepository } from '../../domain/repositories/base.repository.interface';
import { BaseEntity } from '../../domain/entities/base.entity';

export abstract class BaseMongoRepository<T extends BaseEntity> implements IBaseRepository<T> {
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

    async update(id: string, data: Partial<T>): Promise<T | null> {
        return this.model
            .findByIdAndUpdate(id, { $set: data }, { new: true })
            .exec();
    }

    async delete(id: string): Promise<void> {
        await this.model.deleteOne({ _id: id }).exec();
    }
} 