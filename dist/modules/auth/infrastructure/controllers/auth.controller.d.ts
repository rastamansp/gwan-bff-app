import { RegisterUseCase } from '../../domain/use-cases/register.use-case';
import { VerifyCodeUseCase } from '../../domain/use-cases/verify-code.use-case';
import { LoginUseCase } from '../../domain/use-cases/login.use-case';
import { VerifyLoginUseCase } from '../../domain/use-cases/verify-login.use-case';
export declare class AuthController {
    private readonly registerUseCase;
    private readonly verifyCodeUseCase;
    private readonly loginUseCase;
    private readonly verifyLoginUseCase;
    constructor(registerUseCase: RegisterUseCase, verifyCodeUseCase: VerifyCodeUseCase, loginUseCase: LoginUseCase, verifyLoginUseCase: VerifyLoginUseCase);
    register(data: {
        name: string;
        email: string;
        whatsapp: string;
    }): Promise<import("../../domain/entities/user.entity").User>;
    verify(data: {
        email: string;
        code: string;
    }): Promise<import("../../domain/entities/user.entity").User>;
    login(data: {
        email: string;
    }): Promise<import("../../domain/entities/user.entity").User>;
    verifyLogin(data: {
        email: string;
        code: string;
    }): Promise<import("../../domain/entities/user.entity").User>;
}
