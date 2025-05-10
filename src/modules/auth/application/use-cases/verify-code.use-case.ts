import {
    Injectable,
    NotFoundException,
    BadRequestException,
    Logger,
} from "@nestjs/common";
import { User } from "../../domain/entities/user.entity";
import { UserService } from "../../domain/services/user.service";
import { BaseUseCase } from "../../../../core/domain/use-cases/base.use-case";
import { AuthResponseDto, UserResponseDto } from '../../domain/dtos/auth.dtos';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class VerifyCodeUseCase extends BaseUseCase<User> {
    private readonly logger = new Logger(VerifyCodeUseCase.name);

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {
        super(userService);
    }

    async execute(data: { email: string; code: string }): Promise<User> {
        this.logger.log(
            `[Verify] Iniciando verificação de código para: ${data.email}`,
        );

        try {
            // Busca o usuário pelo email
            const user = await this.userService.findByEmail(data.email);
            if (!user) {
                this.logger.warn(`[Verify] Usuário não encontrado: ${data.email}`);
                throw new NotFoundException({
                    message: "Usuário não encontrado",
                    code: "USER_NOT_FOUND",
                    details: {
                        email: data.email,
                    },
                });
            }

            // Verifica se o código é válido
            if (!user.activationCode || !user.activationCodeExpiresAt) {
                this.logger.warn(
                    `[Verify] Código de ativação não encontrado para: ${data.email}`,
                );
                throw new BadRequestException({
                    message: "Código de ativação não encontrado",
                    code: "ACTIVATION_CODE_NOT_FOUND",
                    details: {
                        email: data.email,
                    },
                });
            }

            if (user.activationCode !== data.code) {
                this.logger.warn(
                    `[Verify] Código de ativação inválido para: ${data.email}`,
                );
                throw new BadRequestException({
                    message: "Código de ativação inválido",
                    code: "INVALID_ACTIVATION_CODE",
                    details: {
                        email: data.email,
                        providedCode: data.code,
                    },
                });
            }

            if (user.activationCodeExpiresAt < new Date()) {
                this.logger.warn(
                    `[Verify] Código de ativação expirado para: ${data.email}`,
                );
                throw new BadRequestException({
                    message: "Código de ativação expirado",
                    code: "ACTIVATION_CODE_EXPIRED",
                    details: {
                        email: data.email,
                        expiresAt: user.activationCodeExpiresAt,
                    },
                });
            }

            // Verifica o usuário
            this.logger.log(
                `[Verify] Verificando usuário: ${user.id}, Email: ${user.email}`,
            );
            const verifiedUser = await this.userService.verifyUser(user.id);
            this.logger.log(
                `[Verify] Usuário verificado com sucesso: ${verifiedUser.id}`,
            );

            return verifiedUser;
        } catch (error) {
            this.logger.error(
                `[Verify] Erro durante a verificação: ${error.message}`,
                error.stack,
            );
            throw error;
        }
    }

    private mapToUserResponseDto(user: User): UserResponseDto {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            whatsapp: user.whatsapp,
            isEmailVerified: user.isEmailVerified,
            isActive: user.isActive,
            isVerified: user.isVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
} 