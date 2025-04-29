import { Injectable, ConflictException, Logger } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { NotificationService } from '../services/notification.service';
import { BaseUseCase } from '../../../../core/domain/use-cases/base.use-case';

@Injectable()
export class RegisterUseCase extends BaseUseCase<User> {
  private readonly logger = new Logger(RegisterUseCase.name);

  constructor(
    private readonly userService: UserService,
    private readonly notificationService: NotificationService
  ) {
    super(userService);
  }

  async execute(data: { name: string; email: string; whatsapp: string }): Promise<User> {
    this.logger.log(`Iniciando registro de usuário: ${data.email}`);

    // Verifica se o email já está em uso
    const existingUser = await this.userService.findByEmail(data.email);
    if (existingUser) {
      this.logger.warn(`Tentativa de registro com email já existente: ${data.email}`);
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
      this.logger.warn(`Tentativa de registro com WhatsApp já existente: ${data.whatsapp}`);
      throw new ConflictException({
        message: 'WhatsApp já está em uso',
        code: 'WHATSAPP_ALREADY_EXISTS',
        details: {
          whatsapp: data.whatsapp
        }
      });
    }

    // Cria o usuário
    this.logger.log(`Criando novo usuário: ${data.email}`);
    const user = await this.userService.create({
      ...data,
      isActive: true,
      isVerified: false,
    });
    this.logger.log(`Usuário criado com sucesso. ID: ${user.id}`);

    // Gera código de verificação
    const activationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // Código válido por 10 minutos

    // Atualiza o usuário com o código de verificação
    this.logger.log(`Atualizando código de verificação para usuário: ${user.id}`);
    await this.userService.updateActivationCode(user.id, activationCode, expiresAt);
    this.logger.log(`Código de verificação atualizado: ${activationCode}`);

    // Envia o código por email
    this.logger.log(`Enviando código de verificação por email para: ${user.email}`);
    await this.notificationService.sendEmail(
      user.email,
      'Código de Verificação - GWAN',
      `Olá ${user.name},\n\nSeu código de verificação é: ${activationCode}\n\nEste código é válido por 10 minutos.`
    );
    this.logger.log(`Email de verificação enviado com sucesso para: ${user.email}`);

    // Envia o código por WhatsApp
    this.logger.log(`Enviando código de verificação por WhatsApp para: ${user.whatsapp}`);
    await this.notificationService.sendWhatsApp(
      user.whatsapp,
      `GWAN: Seu código de verificação é: ${activationCode}. Válido por 10 minutos.`
    );
    this.logger.log(`Mensagem WhatsApp enviada com sucesso para: ${user.whatsapp}`);

    this.logger.log(`Processo de registro concluído com sucesso para: ${user.email}`);
    return user;
  }
}