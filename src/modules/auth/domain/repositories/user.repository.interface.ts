import { User } from '../entities/user.entity';
import { IBaseRepository } from '../../../../core/domain/repositories/base.repository.interface';

export interface IUserRepository extends IBaseRepository<User> {
    findByEmail(email: string): Promise<User | null>;
    findByWhatsApp(whatsapp: string): Promise<User | null>;
    findByVerificationCode(code: string): Promise<User | null>;
    updateVerificationStatus(userId: string, isVerified: boolean): Promise<void>;
    updateVerificationCode(userId: string, code: string, expiresAt: Date): Promise<void>;
    updateLoginCode(userId: string, code: string, expiresAt: Date): Promise<void>;
    clearLoginCode(userId: string): Promise<void>;
    updateActivationCode(userId: string, code: string, expiresAt: Date): Promise<void>;
    clearActivationCode(userId: string): Promise<void>;
    verifyUser(userId: string): Promise<void>;
    updateLastLogin(userId: string): Promise<void>;
    deleteMany(filter: any): Promise<void>;
    updatePassword(userId: string, hashedPassword: string): Promise<void>;
} 