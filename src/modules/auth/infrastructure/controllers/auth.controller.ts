import { Controller, Post, Body, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RegisterUseCase } from '../../domain/use-cases/register.use-case';
import { VerifyCodeUseCase } from '../../domain/use-cases/verify-code.use-case';
import { LoginUseCase } from '../../domain/use-cases/login.use-case';
import { VerifyLoginUseCase } from '../../domain/use-cases/verify-login.use-case';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly verifyCodeUseCase: VerifyCodeUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly verifyLoginUseCase: VerifyLoginUseCase,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Pedro Almeida' },
        email: { type: 'string', example: 'pedro.hp.almeida@gmail.com' },
        whatsapp: { type: 'string', example: '+5511999999999' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async register(
    @Body() data: { name: string; email: string; whatsapp: string }
  ) {
    this.logger.log(`[Register] Iniciando processo de registro para ${data.email}`);
    this.logger.debug(`[Register] Dados recebidos: ${JSON.stringify({
      name: data.name,
      email: data.email,
      whatsapp: data.whatsapp
    })}`);

    try {
      const result = await this.registerUseCase.execute(data);
      this.logger.log(`[Register] Registro concluído com sucesso para ${data.email}`);
      return result;
    } catch (error) {
      this.logger.error(`[Register] Erro no registro para ${data.email}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify activation code' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'pedro.hp.almeida@gmail.com' },
        code: { type: 'string', example: '123456' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Code verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid code' })
  async verify(
    @Body() data: { email: string; code: string }
  ) {
    this.logger.log(`[Verify] Iniciando verificação de código para ${data.email}`);
    try {
      const result = await this.verifyCodeUseCase.execute(data);
      this.logger.log(`[Verify] Código verificado com sucesso para ${data.email}`);
      return result;
    } catch (error) {
      this.logger.error(`[Verify] Erro na verificação para ${data.email}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Request login' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'pedro.hp.almeida@gmail.com' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Login code sent successfully' })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  async login(
    @Body() data: { email: string }
  ) {
    this.logger.log(`[Login] Iniciando processo de login para ${data.email}`);
    try {
      const result = await this.loginUseCase.execute(data);
      this.logger.log(`[Login] Código de login enviado com sucesso para ${data.email}`);
      return result;
    } catch (error) {
      this.logger.error(`[Login] Erro no login para ${data.email}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Post('verify-login')
  @ApiOperation({ summary: 'Verify login code' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'pedro.hp.almeida@gmail.com' },
        code: { type: 'string', example: '123456' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 400, description: 'Invalid code' })
  async verifyLogin(
    @Body() data: { email: string; code: string }
  ) {
    this.logger.log(`[VerifyLogin] Iniciando verificação de código de login para ${data.email}`);
    try {
      const result = await this.verifyLoginUseCase.execute(data);
      this.logger.log(`[VerifyLogin] Código de login verificado com sucesso para ${data.email}`);
      return result;
    } catch (error) {
      this.logger.error(`[VerifyLogin] Erro na verificação de login para ${data.email}: ${error.message}`, error.stack);
      throw error;
    }
  }
} 