import { Document } from 'mongoose';
import { IRepository } from './repository.interface';

export interface IService<T extends Document> {
    findById(id: string): Promise<T | null>;
    findAll(): Promise<T[]>;
    create(data: Partial<T>): Promise<T>;
    update(id: string, data: Partial<T>): Promise<T>;
    delete(id: string): Promise<void>;
} 