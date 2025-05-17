import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../../application/services/auth.service';
import { UserRegisterDto, UserLoginDto, UserVerifyCodeDto, UserProfileResponseDto } from '../../../users/domain/dtos/user.dtos';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Registro de usuário' })
    @ApiResponse({
        status: 201,
        description: 'Usuário registrado com sucesso',
        type: UserProfileResponseDto
    })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    @ApiResponse({ status: 409, description: 'Email ou WhatsApp já cadastrado' })
    async register(@Body() registerDto: UserRegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login de usuário' })
    @ApiResponse({
        status: 200,
        description: 'Código de login enviado com sucesso',
        type: UserProfileResponseDto
    })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
    async login(@Body() loginDto: UserLoginDto) {
        return this.authService.login(loginDto.email);
    }

    @Post('verify-code')
    @ApiOperation({ summary: 'Verificação de código' })
    @ApiResponse({
        status: 200,
        description: 'Código verificado com sucesso',
        type: UserProfileResponseDto
    })
    @ApiResponse({ status: 400, description: 'Código inválido ou expirado' })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
    async verifyCode(@Body() verifyCodeDto: UserVerifyCodeDto) {
        return this.authService.verifyCode(verifyCodeDto.email, verifyCodeDto.code);
    }

    @Post('verify-login-code')
    @ApiOperation({ summary: 'Verificação de código de login' })
    @ApiResponse({
        status: 200,
        description: 'Login realizado com sucesso',
        type: UserProfileResponseDto
    })
    @ApiResponse({ status: 400, description: 'Código inválido ou expirado' })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
    async verifyLoginCode(@Body() verifyCodeDto: UserVerifyCodeDto) {
        return this.authService.verifyLoginCode(verifyCodeDto.email, verifyCodeDto.code);
    }
} 