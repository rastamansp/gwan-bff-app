import { Hello } from "../../domain/entities/hello.entity";
import { IHelloRepository } from "../../domain/repositories/hello.repository";
export declare class HelloRepositoryImpl implements IHelloRepository {
    findById(id: string): Promise<Hello | null>;
    findAll(): Promise<Hello[]>;
    create(data: Partial<Hello>): Promise<Hello>;
    update(id: string, data: Partial<Hello>): Promise<Hello>;
    delete(id: string): Promise<void>;
}
