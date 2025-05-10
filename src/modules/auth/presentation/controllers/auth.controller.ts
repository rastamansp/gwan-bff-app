import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    Logger,
} from "@nestjs/common";
import { RegisterUseCase } from "../../application/use-cases/register.use-case";
import { LoginUseCase } from "../../application/use-cases/login.use-case";
import { VerifyCodeUseCase } from "../../application/use-cases/verify-code.use-case";
import { VerifyLoginCodeUseCase } from "../../application/use-cases/verify-login-code.use-case";
import {
    RegisterDto,
    LoginDto,
    VerifyCodeDto,
    VerifyLoginCodeDto,
    AuthResponseDto,
} from "../../domain/dtos/auth.dtos";
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
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
    @ApiOperation({ summary: 'Registrar um novo usuário' })
    @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso' })
    @ApiResponse({ status: 409, description: 'Email ou WhatsApp já cadastrado' })
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
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Iniciar processo de login' })
    @ApiResponse({ status: 200, description: 'Código de login enviado com sucesso' })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
    @ApiResponse({ status: 400, description: 'Usuário não verificado' })
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
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Verificar código de ativação' })
    @ApiResponse({ status: 200, description: 'Usuário verificado com sucesso' })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
    @ApiResponse({ status: 400, description: 'Código inválido ou expirado' })
    async verifyCode(@Body() verifyCodeDto: VerifyCodeDto) {
        this.logger.log("[AuthController] Iniciando verificação de código");
        const user = await this.verifyCodeUseCase.execute({
            email: verifyCodeDto.email,
            code: verifyCodeDto.code,
        });
        this.logger.log("[AuthController] Código verificado com sucesso");
        return {
            message: "Usuário verificado com sucesso.",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        };
    }

    @Post("verify-login-code")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Verificar código de login' })
    @ApiResponse({ status: 200, description: 'Login realizado com sucesso' })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
    @ApiResponse({ status: 400, description: 'Código inválido ou expirado' })
    async verifyLoginCode(@Body() verifyLoginCodeDto: VerifyLoginCodeDto): Promise<AuthResponseDto> {
        this.logger.log("[AuthController] Iniciando verificação de código de login");
        return this.verifyLoginCodeUseCase.execute({
            email: verifyLoginCodeDto.email,
            code: verifyLoginCodeDto.code,
        });
    }
} 