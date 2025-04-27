import { Model } from 'mongoose';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository';
export declare class UserRepositoryImpl implements IUserRepository {
    private readonly userModel;
    constructor(userModel: Model<User>);
    findById(id: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    create(data: Partial<User>): Promise<User>;
    update(id: string, data: Partial<User>): Promise<User>;
    delete(id: string): Promise<void>;
    findByEmail(email: string): Promise<User | null>;
    findByWhatsapp(whatsapp: string): Promise<User | null>;
    updateActivationCode(id: string, code: string, expiresAt: Date): Promise<User>;
    updateLoginCode(id: string, code: string, expiresAt: Date): Promise<User>;
    verifyUser(id: string): Promise<User>;
    updateLastLogin(id: string): Promise<User>;
}
