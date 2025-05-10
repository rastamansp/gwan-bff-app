import { BaseEntity } from '../domain/base.entity';
import { IBaseRepository } from '../domain/base.repository';

export abstract class BaseService<T extends BaseEntity> {
    constructor(protected readonly repository: IBaseRepository<T>) { }

    async findById(id: string): Promise<T | null> {
        return this.repository.findById(id);
    }

    async findAll(): Promise<T[]> {
        return this.repository.findAll();
    }

    async create(data: Partial<T>): Promise<T> {
        return this.repository.create(data);
    }

    async update(id: string, data: Partial<T>): Promise<T | null> {
        return this.repository.update(id, data);
    }

    async delete(id: string): Promise<boolean> {
        return this.repository.delete(id);
    }

    async softDelete(id: string): Promise<boolean> {
        return this.repository.softDelete(id);
    }
} 