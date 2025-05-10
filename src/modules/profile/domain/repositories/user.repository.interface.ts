import { User } from "../entities/user.entity";
import { IBaseRepository } from "../../../../core/domain/repositories/base.repository.interface";

export interface IUserRepository extends IBaseRepository<User> {
    findByEmail(email: string): Promise<User | null>;
    findByWhatsApp(whatsapp: string): Promise<User | null>;
    updateProfile(userId: string, data: Partial<User>): Promise<User>;
} 