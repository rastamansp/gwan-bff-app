import { User } from "../entities/user.entity";
import { IUserRepository } from "../repositories/user.repository";
import { BaseService } from "../../../../core/domain/services/base.service";
export declare class UserService extends BaseService<User> {
    protected readonly repository: IUserRepository;
    constructor(repository: IUserRepository);
    findByEmail(email: string): Promise<User | null>;
    findByWhatsapp(whatsapp: string): Promise<User | null>;
    updateActivationCode(id: string, code: string, expiresAt: Date): Promise<User>;
    updateLoginCode(id: string, code: string, expiresAt: Date): Promise<User>;
    verifyUser(id: string): Promise<User>;
    updateLastLogin(id: string): Promise<User>;
}
