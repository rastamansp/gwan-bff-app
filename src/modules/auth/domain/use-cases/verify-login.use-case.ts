import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { BaseUseCase } from '../../../../core/domain/use-cases/base.use-case';

@Injectable()
export class VerifyLoginUseCase extends BaseUseCase<User> {
  constructor(private readonly userService: UserService) {
    super(userService);
  }

  async execute(data: { email: string; code: string }): Promise<User> {
    // Busca o usuário pelo email
    const user = await this.userService.findByEmail(data.email);
    if (!user) {
      throw new NotFoundException({
        message: 'Usuário não encontrado',
        code: 'USER_NOT_FOUND',
        details: {
          email: data.email
        }
      });
    }

    // Verifica se o código é válido
    if (!user.loginCode || !user.loginCodeExpiresAt) {
      throw new BadRequestException({
        message: 'Código de login não encontrado',
        code: 'LOGIN_CODE_NOT_FOUND',
        details: {
          email: data.email
        }
      });
    }

    if (user.loginCode !== data.code) {
      throw new BadRequestException({
        message: 'Código de login inválido',
        code: 'INVALID_LOGIN_CODE',
        details: {
          email: data.email,
          providedCode: data.code
        }
      });
    }

    if (user.loginCodeExpiresAt < new Date()) {
      throw new BadRequestException({
        message: 'Código de login expirado',
        code: 'LOGIN_CODE_EXPIRED',
        details: {
          email: data.email,
          expiresAt: user.loginCodeExpiresAt
        }
      });
    }

    // Atualiza o último login e limpa o código
    return this.userService.updateLastLogin(user.id);
  }
} 