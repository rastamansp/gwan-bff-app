import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ValidationPipe, Logger } from "@nestjs/common";
import { AppModule } from "./app.module";
import * as mongoose from "mongoose";
import { ConfigService } from "@nestjs/config";
import { HttpExceptionFilter } from "./shared/filters/http-exception.filter";
import { LoggingInterceptor } from "./shared/interceptors/logging.interceptor";
import { NotFoundInterceptor } from "./shared/interceptors/not-found.interceptor";

async function bootstrap() {
  const logger = new Logger("Bootstrap");

  try {
    // Adiciona listener para logs do Mongoose
    mongoose.connection.on("connected", async () => {
      logger.log("[MongoDB] Conexão estabelecida com sucesso");
      try {
        const db = mongoose.connection.db;
        const result = await db.command({ connectionStatus: 1 });
        logger.log(
          "[MongoDB] Usuário autenticado:",
          result?.authInfo?.authenticatedUsers?.[0]?.user || "não disponível",
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

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document);

    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }));

    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new LoggingInterceptor(), new NotFoundInterceptor());

    const port = configService.get<number>("port") || 3000;
    await app.listen(port);
    logger.log(`Application is running on: http://localhost:${port}`);
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
