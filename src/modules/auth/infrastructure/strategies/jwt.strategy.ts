import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new Logger(JwtStrategy.name);

    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET') || 'gwan-secret-key-production-2024',
        });
        this.logger.log('[JWT] Estratégia JWT inicializada');
    }

    async validate(payload: any) {
        this.logger.debug('[JWT] Validando payload do token:', payload);

        if (!payload.sub || !payload.email) {
            this.logger.warn('[JWT] Payload inválido - campos obrigatórios ausentes');
            throw new Error('Token inválido');
        }

        const user = {
            id: payload.sub,
            email: payload.email,
            name: payload.name
        };

        this.logger.debug(`[JWT] Usuário validado: ${user.email}`);
        return user;
    }
} 