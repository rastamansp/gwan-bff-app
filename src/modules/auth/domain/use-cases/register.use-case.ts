import { Injectable, ConflictException } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { NotificationService } from '../services/notification.service';
import { BaseUseCase } from '../../../../core/domain/use-cases/base.use-case';

@Injectable()
export class RegisterUseCase extends BaseUseCase<User> {
  constructor(
    private readonly userService: UserService,
    private readonly notificationService: NotificationService
  ) {
    super(userService);
  }

  async execute(data: { name: string; email: string; whatsapp: string }): Promise<User> {
    // Verifica se o email já está em uso
    const existingUser = await this.userService.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException({
        message: 'Email já está em uso',
        code: 'EMAIL_ALREADY_EXISTS',
        details: {
          email: data.email
        }
      });
    }

    // Verifica se o WhatsApp já está em uso
    const existingWhatsapp = await this.userService.findByWhatsapp(data.whatsapp);
    if (existingWhatsapp) {
      throw new ConflictException({
        message: 'WhatsApp já está em uso',
        code: 'WHATSAPP_ALREADY_EXISTS',
        details: {
          whatsapp: data.whatsapp
        }
      });
    }

    // Cria o usuário
    const user = await this.userService.create({
      ...data,
      isActive: true,
      isVerified: false,
    });

    // Gera código de verificação
    const activationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // Código válido por 10 minutos

    // Atualiza o usuário com o código de verificação
    await this.userService.updateActivationCode(user.id, activationCode, expiresAt);

    // Envia o código por email
    await this.notificationService.sendEmail(
      user.email,
      'Código de Verificação - GWAN',
      `Olá ${user.name},\n\nSeu código de verificação é: ${activationCode}\n\nEste código é válido por 10 minutos.`
    );

    // Envia o código por WhatsApp
    await this.notificationService.sendWhatsApp(
      user.whatsapp,
      `GWAN: Seu código de verificação é: ${activationCode}. Válido por 10 minutos.`
    );

    return user;
  }
}