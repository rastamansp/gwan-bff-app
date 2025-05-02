import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  private readonly logger = new Logger(JwtAuthGuard.name);
  private readonly publicRoutes = [
    '/api/auth/login',
    '/api/auth/verify-login',
    '/api/auth/register',
    '/api/auth/verify'
  ];

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const path = request.path;

    // Verifica se a rota é pública
    if (this.publicRoutes.includes(path)) {
      this.logger.debug(`[Auth] Rota pública acessada: ${request.method} ${path}`);
      return true;
    }

    this.logger.debug(
      `[Auth] Verificando autenticação para rota: ${request.method} ${path}`,
    );

    const authHeader = request.headers.authorization;
    if (!authHeader) {
      this.logger.warn("[Auth] Header de autorização não encontrado");
      return false;
    }

    if (!authHeader.startsWith("Bearer ")) {
      this.logger.warn(
        '[Auth] Formato inválido do header de autorização. Deve começar com "Bearer "',
      );
      return false;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err) {
      this.logger.error("[Auth] Erro na autenticação:", err);
      throw err;
    }

    if (!user) {
      this.logger.warn("[Auth] Usuário não encontrado no token JWT");
      throw new UnauthorizedException("Usuário não autenticado");
    }

    this.logger.debug(`[Auth] Usuário autenticado com sucesso: ${user.email}`);
    return user;
  }
}
