import { LoginDto } from '../dtos/login.dto';

export interface IAuthService {
    login(loginDto: LoginDto): Promise<{ access_token: string }>;
    validateUser(email: string, password: string): Promise<any>;
    generateToken(payload: any): string;
} 