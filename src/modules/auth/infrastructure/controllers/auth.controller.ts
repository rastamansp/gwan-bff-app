import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { RegisterUseCase } from '../../domain/use-cases/register.use-case';
import { LoginUseCase } from '../../domain/use-cases/login.use-case';
import { VerifyCodeUseCase } from '../../domain/use-cases/verify-code.use-case';
import { VerifyLoginCodeUseCase } from '../../domain/use-cases/verify-login-code.use-case';
import {
  RegisterDto,
  LoginDto,
  VerifyCodeDto,
  VerifyLoginCodeDto,
  AuthResponseDto,
} from '../../domain/dtos/auth.dtos';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly verifyCodeUseCase: VerifyCodeUseCase,
    private readonly verifyLoginCodeUseCase: VerifyLoginCodeUseCase,
  ) { }

  @Post('register')
  @ApiOperation({ summary: 'Registrar novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Email ou WhatsApp já cadastrado' })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    const user = await this.registerUseCase.execute(registerDto);
    return {
      accessToken: null,
      user,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar processo de login' })
  @ApiResponse({ status: 200, description: 'Código de login enviado' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.loginUseCase.execute({ email: loginDto.email });
    return {
      accessToken: null,
      user,
    };
  }

  @Post('verify-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verificar código de ativação' })
  @ApiResponse({ status: 200, description: 'Código verificado com sucesso' })
  @ApiResponse({ status: 400, description: 'Código inválido ou expirado' })
  async verifyCode(@Body() verifyCodeDto: VerifyCodeDto): Promise<AuthResponseDto> {
    const user = await this.verifyCodeUseCase.execute({
      email: verifyCodeDto.email,
      code: verifyCodeDto.code,
    });
    return {
      accessToken: null,
      user,
    };
  }

  @Post('verify-login-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verificar código de login' })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso' })
  @ApiResponse({ status: 400, description: 'Código inválido ou expirado' })
  async verifyLoginCode(
    @Body() verifyLoginCodeDto: VerifyLoginCodeDto,
  ): Promise<AuthResponseDto> {
    return this.verifyLoginCodeUseCase.execute({
      email: verifyLoginCodeDto.email,
      code: verifyLoginCodeDto.code,
    });
  }
}
