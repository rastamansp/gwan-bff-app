import {
    Injectable,
    NotFoundException,
    BadRequestException,
    Logger,
} from "@nestjs/common";
import { User } from "../../domain/entities/user.entity";
import { UserService } from "../../domain/services/user.service";
import { NotificationService } from "../../domain/services/notification.service";
import { BaseUseCase } from "../../../../core/domain/use-cases/base.use-case";
import { Email } from "../../domain/value-objects/email.value-object";

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
        // Normaliza o email antes de buscar
        const normalizedEmail = Email.create(data.email).getValue();
        this.logger.log(`[Login] Iniciando processo de login para: ${normalizedEmail}`);

        try {
            // Busca o usuário pelo email normalizado
            this.logger.debug(`[Login] Buscando usuário por email: ${normalizedEmail}`);
            const user = await this.userService.findByEmail(normalizedEmail);
            if (!user) {
                this.logger.warn(`[Login] Usuário não encontrado: ${normalizedEmail}`);
                throw new NotFoundException({
                    message: "Usuário não encontrado",
                    code: "USER_NOT_FOUND",
                    details: {
                        email: normalizedEmail,
                    },
                });
            }

            if (!user.isVerified) {
                this.logger.warn(
                    `[Login] Tentativa de login com usuário não verificado: ${normalizedEmail}`,
                );
                throw new BadRequestException({
                    message: "Usuário não está verificado",
                    code: "USER_NOT_VERIFIED",
                    details: {
                        email: normalizedEmail,
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
                    `Olá ${user.name},\n\nSeu código de login é: ${loginCode}\n\nEste código é válido por 10 minutos.`,
                );
                this.logger.log(
                    `[Login] Email de login enviado com sucesso: ${user.email}`,
                );
            } catch (error) {
                this.logger.error(
                    `[Login] Erro ao enviar email de login: ${error.message}`,
                    error.stack,
                );
                // Não lançamos o erro aqui para continuar com o envio do WhatsApp
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
                // Não lançamos o erro aqui pois o email já foi enviado
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