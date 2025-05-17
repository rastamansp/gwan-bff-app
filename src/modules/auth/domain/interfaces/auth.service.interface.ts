import { UserLoginDto } from '../../../users/domain/dtos/user.dtos';

export interface IAuthService {
    login(loginDto: UserLoginDto): Promise<{ access_token: string }>;
    validateUser(email: string, password: string): Promise<any>;
    generateToken(payload: any): string;
} 