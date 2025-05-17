import { LoginDto } from '../dtos/auth.dtos';

export interface IAuthService {
    login(loginDto: LoginDto): Promise<{ access_token: string }>;
    validateUser(email: string, password: string): Promise<any>;
    generateToken(payload: any): string;
} 