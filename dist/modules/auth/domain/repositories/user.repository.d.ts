import { User } from '../entities/user.entity';
import { IBaseRepository } from '../../../../core/domain/repositories/base.repository';
export interface IUserRepository extends IBaseRepository<User> {
    findByEmail(email: string): Promise<User | null>;
    findByWhatsapp(whatsapp: string): Promise<User | null>;
    updateActivationCode(id: string, code: string, expiresAt: Date): Promise<User>;
    updateLoginCode(id: string, code: string, expiresAt: Date): Promise<User>;
    verifyUser(id: string): Promise<User>;
    updateLastLogin(id: string): Promise<User>;
}
