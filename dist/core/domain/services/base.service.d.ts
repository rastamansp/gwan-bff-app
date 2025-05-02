import { BaseEntity } from "../entities/base.entity";
import { IBaseRepository } from "../repositories/base.repository";
export declare abstract class BaseService<T extends BaseEntity> {
    protected readonly repository: IBaseRepository<T>;
    constructor(repository: IBaseRepository<T>);
    findById(id: string): Promise<T | null>;
    findAll(): Promise<T[]>;
    create(data: Partial<T>): Promise<T>;
    update(id: string, data: Partial<T>): Promise<T>;
    delete(id: string): Promise<void>;
}
