import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { BaseUseCase } from '../../../../core/domain/use-cases/base.use-case';

@Injectable()
export class LoginUseCase extends BaseUseCase<User> {
  constructor(private readonly userService: UserService) {
    super(userService);
  }

  async execute(data: { email: string }): Promise<User> {
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

    if (!user.isVerified) {
      throw new BadRequestException({
        message: 'Usuário não está verificado',
        code: 'USER_NOT_VERIFIED',
        details: {
          email: data.email
        }
      });
    }

    // Gera código de login
    const loginCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // Código válido por 10 minutos

    // Atualiza o usuário com o código de login
    await this.userService.updateLoginCode(user.id, loginCode, expiresAt);

    // TODO: Enviar código por WhatsApp
    console.log(`Código de login: ${loginCode}`);

    return user;
  }
} 