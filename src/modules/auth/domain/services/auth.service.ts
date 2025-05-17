import { Injectable, Logger, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { UserService } from './user.service';

import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { UserRegisterDto } from '@/modules/users/domain/dtos/user.dtos';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        @Inject('UserService')
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async register(registerDto: UserRegisterDto): Promise<User> {
        this.logger.debug(`[Register] Iniciando registro para: ${registerDto.email}`);

        const existingUser = await this.userService.findByEmail(registerDto.email);
        if (existingUser) {
            this.logger.warn(`[Register] Email já cadastrado: ${registerDto.email}`);
            throw new ConflictException('Email já cadastrado');
        }

        const existingWhatsapp = await this.userService.findByWhatsApp(registerDto.whatsapp);
        if (existingWhatsapp) {
            this.logger.warn(`[Register] WhatsApp já cadastrado: ${registerDto.whatsapp}`);
            throw new ConflictException('WhatsApp já cadastrado');
        }

        const user = await this.userService.create({
            name: registerDto.name,
            email: registerDto.email,
            whatsapp: registerDto.whatsapp,
            isEmailVerified: false,
            isActive: true,
            isVerified: false,
        });

        this.logger.debug(`[Register] Usuário criado com sucesso: ${user.id}`);

        return user;
    }

    async login(email: string): Promise<User> {
        this.logger.debug(`[Login] Iniciando login para: ${email}`);

        const user = await this.userService.findByEmail(email);
        if (!user) {
            this.logger.warn(`[Login] Usuário não encontrado: ${email}`);
            throw new UnauthorizedException('Credenciais inválidas');
        }

        if (!user.isEmailVerified) {
            this.logger.warn(`[Login] Email não verificado: ${email}`);
            throw new UnauthorizedException('Email não verificado');
        }

        this.logger.debug(`[Login] Usuário encontrado: ${user.id}`);

        return user;
    }

    async verifyCode(email: string, code: string): Promise<User> {
        this.logger.debug(`[Verify] Verificando código para: ${email}`);

        const user = await this.userService.findByEmail(email);
        if (!user) {
            this.logger.warn(`[Verify] Usuário não encontrado: ${email}`);
            throw new UnauthorizedException('Usuário não encontrado');
        }

        if (user.activationCode !== code) {
            this.logger.warn(`[Verify] Código inválido para: ${email}`);
            throw new UnauthorizedException('Código inválido');
        }

        if (user.activationCodeExpiresAt < new Date()) {
            this.logger.warn(`[Verify] Código expirado para: ${email}`);
            throw new UnauthorizedException('Código expirado');
        }

        const verifiedUser = await this.userService.verifyUser(user.id);
        this.logger.debug(`[Verify] Usuário verificado com sucesso: ${verifiedUser.id}`);

        return verifiedUser;
    }

    async verifyLoginCode(email: string, code: string): Promise<{ accessToken: string; user: User }> {
        this.logger.debug(`[VerifyLogin] Verificando código de login para: ${email}`);

        const user = await this.userService.findByEmail(email);
        if (!user) {
            this.logger.warn(`[VerifyLogin] Usuário não encontrado: ${email}`);
            throw new UnauthorizedException('Usuário não encontrado');
        }

        if (user.loginCode !== code) {
            this.logger.warn(`[VerifyLogin] Código inválido para: ${email}`);
            throw new UnauthorizedException('Código inválido');
        }

        if (user.loginCodeExpiresAt < new Date()) {
            this.logger.warn(`[VerifyLogin] Código expirado para: ${email}`);
            throw new UnauthorizedException('Código expirado');
        }

        await this.userService.clearLoginCode(user.id);
        await this.userService.updateLastLogin(user.id);

        const payload = { sub: user.id, email: user.email };
        const accessToken = this.jwtService.sign(payload);

        this.logger.debug(`[VerifyLogin] Login realizado com sucesso: ${user.id}`);

        return {
            accessToken,
            user,
        };
    }
} 