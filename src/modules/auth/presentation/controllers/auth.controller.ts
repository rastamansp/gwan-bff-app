import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    Logger,
} from "@nestjs/common";
import { RegisterUseCase } from "../../domain/use-cases/register.use-case";
import { LoginUseCase } from "../../domain/use-cases/login.use-case";
import { VerifyCodeUseCase } from "../../domain/use-cases/verify-code.use-case";
import { VerifyLoginCodeUseCase } from "../../domain/use-cases/verify-login-code.use-case";
import {
    RegisterDto,
    LoginDto,
    VerifyCodeDto,
    VerifyLoginCodeDto,
} from "../../domain/dtos/auth.dtos";

@Controller("auth")
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(
        private readonly registerUseCase: RegisterUseCase,
        private readonly loginUseCase: LoginUseCase,
        private readonly verifyCodeUseCase: VerifyCodeUseCase,
        private readonly verifyLoginCodeUseCase: VerifyLoginCodeUseCase,
    ) { }

    @Post("register")
    async register(@Body() registerDto: RegisterDto) {
        this.logger.log("[AuthController] Iniciando registro de usuário");
        const user = await this.registerUseCase.execute({
            name: registerDto.name,
            email: registerDto.email,
            whatsapp: registerDto.whatsapp,
        });
        this.logger.log("[AuthController] Registro concluído com sucesso");
        return {
            message: "Usuário registrado com sucesso. Verifique seu email e WhatsApp para ativar sua conta.",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        };
    }

    @Post("login")
    async login(@Body() loginDto: LoginDto) {
        this.logger.log("[AuthController] Iniciando processo de login");
        const user = await this.loginUseCase.execute({
            email: loginDto.email,
        });
        this.logger.log("[AuthController] Código de login enviado com sucesso");
        return {
            message: "Código de login enviado com sucesso. Verifique seu email e WhatsApp.",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        };
    }

    @Post("verify-code")
    async verifyCode(@Body() verifyCodeDto: VerifyCodeDto) {
        this.logger.log("[AuthController] Iniciando verificação de código");
        const user = await this.verifyCodeUseCase.execute({
            email: verifyCodeDto.email,
            code: verifyCodeDto.code,
        });
        this.logger.log("[AuthController] Código verificado com sucesso");
        return {
            message: "Código verificado com sucesso. Sua conta foi ativada.",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        };
    }

    @Post("verify-login-code")
    @HttpCode(HttpStatus.OK)
    async verifyLoginCode(@Body() verifyLoginCodeDto: VerifyLoginCodeDto) {
        this.logger.log("[AuthController] Iniciando verificação de código de login");
        const result = await this.verifyLoginCodeUseCase.execute({
            email: verifyLoginCodeDto.email,
            code: verifyLoginCodeDto.code,
        });
        this.logger.log("[AuthController] Login realizado com sucesso");
        return result;
    }
} 