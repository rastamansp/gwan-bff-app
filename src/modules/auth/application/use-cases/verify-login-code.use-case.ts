import {
    Injectable,
    NotFoundException,
    BadRequestException,
    Logger,
} from "@nestjs/common";
import { User } from "../../domain/entities/user.entity";
import { UserService } from "../../domain/services/user.service";
import { JwtService } from "@nestjs/jwt";
import { BaseUseCase } from "../../../../core/domain/use-cases/base.use-case";
import { UserProfileResponseDto, UserAuthResponseDto } from '../../../users/domain/dtos/user.dtos';

@Injectable()
export class VerifyLoginCodeUseCase extends BaseUseCase<User> {
    private readonly logger = new Logger(VerifyLoginCodeUseCase.name);

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {
        super(userService);
    }

    async execute(data: {
        email: string;
        code: string;
    }): Promise<UserAuthResponseDto> {
        this.logger.log(
            `[VerifyLoginCode] Iniciando verificação de código para: ${data.email}`,
        );

        try {
            // Busca o usuário pelo email
            this.logger.debug(
                `[VerifyLoginCode] Buscando usuário por email: ${data.email}`,
            );
            const user = await this.userService.findByEmail(data.email);
            if (!user) {
                this.logger.warn(
                    `[VerifyLoginCode] Usuário não encontrado: ${data.email}`,
                );
                throw new NotFoundException({
                    message: "Usuário não encontrado",
                    code: "USER_NOT_FOUND",
                    details: {
                        email: data.email,
                    },
                });
            }

            // Verifica se o código está expirado
            if (!user.loginCodeExpiresAt || user.loginCodeExpiresAt < new Date()) {
                this.logger.warn(
                    `[VerifyLoginCode] Código expirado para usuário: ${user.id}`,
                );
                throw new BadRequestException({
                    message: "Código de login expirado",
                    code: "LOGIN_CODE_EXPIRED",
                    details: {
                        email: data.email,
                    },
                });
            }

            // Verifica se o código está correto
            if (user.loginCode !== data.code) {
                this.logger.warn(
                    `[VerifyLoginCode] Código inválido para usuário: ${user.id}`,
                );
                throw new BadRequestException({
                    message: "Código de login inválido",
                    code: "INVALID_LOGIN_CODE",
                    details: {
                        email: data.email,
                    },
                });
            }

            // Atualiza o último login e limpa o código
            this.logger.debug(
                `[VerifyLoginCode] Atualizando último login para usuário: ${user.id}`,
            );
            const updatedUser = await this.userService.updateLastLogin(user.id);
            this.logger.debug(
                `[VerifyLoginCode] Último login atualizado com sucesso: ${updatedUser.id}`,
            );

            // Gera o token JWT
            this.logger.debug(
                `[VerifyLoginCode] Gerando token JWT para usuário: ${updatedUser.id}`,
            );
            const accessToken = this.generateToken(updatedUser);
            this.logger.debug(
                `[VerifyLoginCode] Token JWT gerado com sucesso para usuário: ${updatedUser.id}`,
            );

            this.logger.log(
                `[VerifyLoginCode] Processo de verificação concluído com sucesso para: ${updatedUser.email}`,
            );
            return this.createAuthResponse(updatedUser, accessToken);
        } catch (error) {
            this.logger.error(
                `[VerifyLoginCode] Erro durante a verificação: ${error.message}`,
                error.stack,
            );
            throw error;
        }
    }

    private generateToken(user: User): string {
        const payload = {
            sub: user.id,
            email: user.email,
            isEmailVerified: user.isEmailVerified,
        };
        return this.jwtService.sign(payload);
    }

    private createAuthResponse(user: User, accessToken: string): UserAuthResponseDto {
        return {
            accessToken,
            user: this.mapToUserResponseDto(user),
        };
    }

    private mapToUserResponseDto(user: User): UserProfileResponseDto {
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