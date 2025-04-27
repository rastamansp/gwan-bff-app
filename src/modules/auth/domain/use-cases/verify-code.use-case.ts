import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { BaseUseCase } from '../../../../core/domain/use-cases/base.use-case';

@Injectable()
export class VerifyCodeUseCase extends BaseUseCase<User> {
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
    if (!user.activationCode || !user.activationCodeExpiresAt) {
      throw new BadRequestException({
        message: 'Código de ativação não encontrado',
        code: 'ACTIVATION_CODE_NOT_FOUND',
        details: {
          email: data.email
        }
      });
    }

    if (user.activationCode !== data.code) {
      throw new BadRequestException({
        message: 'Código de ativação inválido',
        code: 'INVALID_ACTIVATION_CODE',
        details: {
          email: data.email,
          providedCode: data.code
        }
      });
    }

    if (user.activationCodeExpiresAt < new Date()) {
      throw new BadRequestException({
        message: 'Código de ativação expirado',
        code: 'ACTIVATION_CODE_EXPIRED',
        details: {
          email: data.email,
          expiresAt: user.activationCodeExpiresAt
        }
      });
    }

    // Verifica o usuário
    return this.userService.verifyUser(user.id);
  }
} 