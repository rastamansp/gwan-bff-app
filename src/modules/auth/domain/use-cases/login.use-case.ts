import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { User } from "../entities/user.entity";
import { UserService } from "../services/user.service";
import { NotificationService } from "../services/notification.service";
import { BaseUseCase } from "../../../../core/domain/use-cases/base.use-case";

@Injectable()
export class LoginUseCase extends BaseUseCase<User> {
  private readonly logger = new Logger(LoginUseCase.name);

  constructor(
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
  ) {
    super(userService);
  }

  async execute(data: { email: string }): Promise<User> {
    this.logger.log(`[Login] Iniciando processo de login para: ${data.email}`);

    try {
      // Busca o usuário pelo email
      this.logger.debug(`[Login] Buscando usuário por email: ${data.email}`);
      const user = await this.userService.findByEmail(data.email);
      if (!user) {
        this.logger.warn(`[Login] Usuário não encontrado: ${data.email}`);
        throw new NotFoundException({
          message: "Usuário não encontrado",
          code: "USER_NOT_FOUND",
          details: {
            email: data.email,
          },
        });
      }

      if (!user.isVerified) {
        this.logger.warn(
          `[Login] Tentativa de login com usuário não verificado: ${data.email}`,
        );
        throw new BadRequestException({
          message: "Usuário não está verificado",
          code: "USER_NOT_VERIFIED",
          details: {
            email: data.email,
          },
        });
      }

      // Gera código de login
      const loginCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10); // Código válido por 10 minutos

      this.logger.debug(
        `[Login] Gerando código de login para usuário: ${user.id}`,
      );
      await this.userService.updateLoginCode(user.id, loginCode, expiresAt);
      this.logger.debug(
        `[Login] Código de login gerado e salvo. Expira em: ${expiresAt.toISOString()}`,
      );

      // Envia o código por email
      this.logger.log(
        `[Login] Iniciando envio de código por email: ${user.email}`,
      );
      try {
        await this.notificationService.sendEmail(
          user.email,
          "Código de Login - GWAN",
          `Olá ${user.name},\n\nSeu código de login é: ${loginCode}\n\nEste código é válido por 10 minutos.\n\nSe você não solicitou este código, ignore este email.`,
        );
        this.logger.log(
          `[Login] Email com código de login enviado com sucesso: ${user.email}`,
        );
      } catch (error) {
        this.logger.error(
          `[Login] Erro ao enviar email com código de login: ${error.message}`,
          error.stack,
        );
        throw new BadRequestException({
          message: "Erro ao enviar código de login por email",
          code: "EMAIL_SEND_ERROR",
          details: {
            email: user.email,
          },
        });
      }

      // Envia o código por WhatsApp
      this.logger.log(
        `[Login] Iniciando envio de código por WhatsApp: ${user.whatsapp}`,
      );
      try {
        await this.notificationService.sendWhatsApp(
          user.whatsapp,
          `GWAN: Seu código de login é: ${loginCode}. Válido por 10 minutos.`,
        );
        this.logger.log(
          `[Login] Mensagem WhatsApp enviada com sucesso: ${user.whatsapp}`,
        );
      } catch (error) {
        this.logger.error(
          `[Login] Erro ao enviar mensagem WhatsApp: ${error.message}`,
          error.stack,
        );
        // Não lançamos erro aqui pois o email já foi enviado
      }

      this.logger.log(
        `[Login] Processo de login concluído com sucesso para: ${user.email}`,
      );
      return user;
    } catch (error) {
      this.logger.error(
        `[Login] Erro durante o processo de login: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
