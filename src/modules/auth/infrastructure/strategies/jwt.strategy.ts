import { Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { UserService } from "../../domain/services/user.service";

const JWT_SECRET = process.env.JWT_SECRET || "gwan-secret-key-production-2024";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private configService: ConfigService,
    private userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
    this.logger.log("[JWT] Estratégia JWT inicializada");
  }

  async validate(payload: any) {
    this.logger.debug("[JWT] Validando payload do token:", payload);

    if (!payload.sub || !payload.email) {
      this.logger.warn("[JWT] Payload inválido - campos obrigatórios ausentes");
      throw new Error("Token inválido");
    }

    const user = await this.userService.findById(payload.sub);
    if (!user) {
      this.logger.warn(`[JWT] Usuário não encontrado: ${payload.sub}`);
      throw new Error("Usuário não encontrado");
    }

    this.logger.debug(`[JWT] Usuário validado: ${user.email}`);
    return user;
  }
}
