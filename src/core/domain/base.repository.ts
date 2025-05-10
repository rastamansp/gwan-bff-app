import { BaseEntity } from './base.entity';

export interface IBaseRepository<T extends BaseEntity> {
    findById(id: string): Promise<T | null>;
    findAll(): Promise<T[]>;
    create(data: Partial<T>): Promise<T>;
    update(id: string, data: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
    softDelete(id: string): Promise<boolean>;
} 