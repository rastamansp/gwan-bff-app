import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RegisterUseCase } from '../../domain/use-cases/register.use-case';
import { VerifyCodeUseCase } from '../../domain/use-cases/verify-code.use-case';
import { LoginUseCase } from '../../domain/use-cases/login.use-case';
import { VerifyLoginUseCase } from '../../domain/use-cases/verify-login.use-case';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
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
    return this.registerUseCase.execute(data);
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
    return this.verifyCodeUseCase.execute(data);
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
    return this.loginUseCase.execute(data);
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
    return this.verifyLoginUseCase.execute(data);
  }
} 