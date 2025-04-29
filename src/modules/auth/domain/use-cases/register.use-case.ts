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
    this.logger.log(`[Register] Iniciando fluxo de registro para usuário: ${data.email}`);
    this.logger.debug(`[Register] Dados de registro recebidos: ${JSON.stringify({
      name: data.name,
      email: data.email,
      whatsapp: data.whatsapp
    })}`);

    try {
      // Verifica se o email já está em uso
      this.logger.debug(`[Register] Verificando se email já está em uso: ${data.email}`);
      const existingUser = await this.userService.findByEmail(data.email);
      if (existingUser) {
        this.logger.warn(`[Register] Tentativa de registro com email já existente: ${data.email}`);
        throw new ConflictException({
          message: 'Email já está em uso',
          code: 'EMAIL_ALREADY_EXISTS',
          details: {
            email: data.email
          }
        });
      }
      this.logger.debug(`[Register] Email disponível para uso: ${data.email}`);

      // Verifica se o WhatsApp já está em uso
      this.logger.debug(`[Register] Verificando se WhatsApp já está em uso: ${data.whatsapp}`);
      const existingWhatsapp = await this.userService.findByWhatsapp(data.whatsapp);
      if (existingWhatsapp) {
        this.logger.warn(`[Register] Tentativa de registro com WhatsApp já existente: ${data.whatsapp}`);
        throw new ConflictException({
          message: 'WhatsApp já está em uso',
          code: 'WHATSAPP_ALREADY_EXISTS',
          details: {
            whatsapp: data.whatsapp
          }
        });
      }
      this.logger.debug(`[Register] WhatsApp disponível para uso: ${data.whatsapp}`);

      // Cria o usuário
      this.logger.log(`[Register] Criando novo usuário no banco de dados: ${data.email}`);
      const user = await this.userService.create({
        ...data,
        isActive: true,
        isVerified: false,
      });
      this.logger.log(`[Register] Usuário criado com sucesso. ID: ${user.id}, Email: ${user.email}`);

      // Gera código de verificação
      const activationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10);

      this.logger.debug(`[Register] Gerando código de verificação para usuário: ${user.id}`);
      await this.userService.updateActivationCode(user.id, activationCode, expiresAt);
      this.logger.debug(`[Register] Código de verificação gerado e salvo. Expira em: ${expiresAt.toISOString()}`);

      // Envia o código por email
      this.logger.log(`[Register] Iniciando envio de código por email: ${user.email}`);
      try {
        await this.notificationService.sendEmail(
          user.email,
          'Código de Verificação - GWAN',
          `Olá ${user.name},\n\nSeu código de verificação é: ${activationCode}\n\nEste código é válido por 10 minutos.`
        );
        this.logger.log(`[Register] Email de verificação enviado com sucesso: ${user.email}`);
      } catch (error) {
        this.logger.error(`[Register] Erro ao enviar email de verificação: ${error.message}`, error.stack);
        // Não lançamos o erro aqui para continuar com o envio do WhatsApp
      }

      // Envia o código por WhatsApp
      this.logger.log(`[Register] Iniciando envio de código por WhatsApp: ${user.whatsapp}`);
      try {
        await this.notificationService.sendWhatsApp(
          user.whatsapp,
          `GWAN: Seu código de verificação é: ${activationCode}. Válido por 10 minutos.`
        );
        this.logger.log(`[Register] Mensagem WhatsApp enviada com sucesso: ${user.whatsapp}`);
      } catch (error) {
        this.logger.error(`[Register] Erro ao enviar mensagem WhatsApp: ${error.message}`, error.stack);
        // Não lançamos o erro aqui pois o email já foi enviado
      }

      this.logger.log(`[Register] Processo de registro concluído com sucesso para: ${user.email}`);
      return user;
    } catch (error) {
      this.logger.error(`[Register] Erro durante o processo de registro: ${error.message}`, error.stack);
      throw error;
    }
  }
}