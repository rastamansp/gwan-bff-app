import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ValidationPipe, Logger } from "@nestjs/common";
import { AppModule } from "./app.module";
import * as mongoose from "mongoose";
import { ConfigService } from "@nestjs/config";
import { HttpExceptionFilter } from "./shared/filters/http-exception.filter";
import { LoggingInterceptor } from "./shared/interceptors/logging.interceptor";
import { validateEnv } from "./config/env.validation";

function printRoutesInfo() {
  const logger = new Logger('Routes');
  const baseUrl = process.env.API_URL;

  logger.log('=== Informações da API ===');
  logger.log(`Swagger: ${baseUrl}/api`);
  logger.log(`API: ${baseUrl}`);
  logger.log('Rotas por domínio:');

  // Auth
  logger.log('Auth (/auth)');
  logger.log('POST /auth/register - Registro de usuário');
  logger.log('POST /auth/login - Login de usuário');
  logger.log('POST /auth/verify-code - Verificação de código');
  logger.log('POST /auth/verify-login-code - Verificação de código de login');

  // User
  logger.log('User (/users)');
  logger.log('GET /users/profile - Obter perfil do usuário');
  logger.log('PUT /users/profile - Atualizar perfil do usuário');

  // Knowledge
  logger.log('Knowledge (/knowledge)');
  logger.log('GET /knowledge - Listar todo conhecimento');
  logger.log('GET /knowledge/:id - Buscar conhecimento por ID');
  logger.log('GET /knowledge/category/:category - Buscar por categoria');
  logger.log('GET /knowledge/author - Buscar por autor');
  logger.log('GET /knowledge/tags - Buscar por tags');
  logger.log('GET /knowledge/my - Buscar conhecimento do usuário atual');
  logger.log('POST /knowledge - Criar conhecimento');
  logger.log('PUT /knowledge/:id - Atualizar conhecimento');

  // Dataset
  logger.log('Dataset (/user/dataset)');
  logger.log('POST /user/dataset - Upload de dataset');
  logger.log('GET /user/dataset - Listar datasets');
  logger.log('GET /user/dataset/:id - Buscar dataset por ID');

  // Health
  logger.log('Health (/health)');
  logger.log('GET /health - Verificação de saúde da aplicação');

  logger.log('Observações:');
  logger.log('- Todas as rotas (exceto /auth/* e /health) requerem autenticação JWT');
  logger.log('- A documentação completa está disponível no Swagger UI');
  logger.log('- As rotas estão organizadas por domínio seguindo princípios de Clean Architecture');
  logger.log('- Cada rota possui validação de DTOs e tratamento de erros');
  logger.log('- As respostas são padronizadas e documentadas com Swagger');
  logger.log('- Maiores detalhes acesse http://localhost:3000/api');
}

async function bootstrap() {
  const logger = new Logger("Bootstrap");

  try {
    // Validar variáveis de ambiente
    validateEnv();

    // Adiciona listener para logs do Mongoose
    mongoose.connection.on("connected", async () => {
      logger.log("[MongoDB] Conexão estabelecida com sucesso");
      try {
        const db = mongoose.connection.db;
        const result = await db.command({ connectionStatus: 1 });
        logger.log(
          "[MongoDB] Detalhes da conexão:",
          {
            database: db.databaseName,
            user: result?.authInfo?.authenticatedUsers?.[0]?.user || "não disponível",
            host: mongoose.connection.host,
            port: mongoose.connection.port,
            name: mongoose.connection.name
          }
        );
      } catch (err) {
        logger.error("[MongoDB] Erro ao obter status da conexão:", err);
      }
    });

    mongoose.connection.on("error", (err) => {
      logger.error("[MongoDB] Erro na conexão:", err);
    });

    mongoose.connection.on("disconnected", () => {
      logger.log("[MongoDB] Desconectado");
    });

    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // Configuração do prefixo global
    app.setGlobalPrefix('api');

    // Configuração do CORS
    app.enableCors(configService.get('cors'));

    // Configuração do Swagger
    const swaggerConfig = configService.get('swagger') || {
      title: 'GWAN API',
      description: 'API do sistema GWAN',
      version: '1.0'
    };
    const config = new DocumentBuilder()
      .setTitle(swaggerConfig.title)
      .setDescription(swaggerConfig.description)
      .setVersion(swaggerConfig.version)
      .addBearerAuth(
        {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          name: "JWT",
          description: "Enter JWT token",
          in: "header",
        },
        "JWT",
      )
      .build();

    const document = SwaggerModule.createDocument(app, config, {
      extraModels: [],
      operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
      deepScanRoutes: true,
    });

    // Configurar nomes únicos para schemas
    if (document.components && document.components.schemas) {
      const schemas = document.components.schemas;
      const newSchemas = {};

      Object.keys(schemas).forEach(key => {
        const schema = schemas[key];
        if (schema && typeof schema === 'object') {
          // Garantir que cada schema tenha um nome único
          const newKey = key.length <= 2 ? `Schema_${key}` : key;
          newSchemas[newKey] = schema;
        }
      });

      document.components.schemas = newSchemas;
    }

    SwaggerModule.setup("api", app, document);

    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }));

    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new LoggingInterceptor());

    const port = configService.get<number>("port") || 3000;
    await app.listen(port);
    logger.log(`Application is running on: http://localhost:${port}`);

    // Exibir informações das rotas
    printRoutesInfo();
  } catch (error) {
    logger.error("Erro ao iniciar a aplicação:", error);
    process.exit(1);
  }
}

// Tratamento de erros não capturados
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

bootstrap();
