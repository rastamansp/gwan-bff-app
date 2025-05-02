import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import * as mongoose from "mongoose";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

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
    app.enableCors({
      origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://bff.gwan.com.br",
        "https://www.bff.gwan.com.br",
        "https://admin.gwan.com.br",
        "https://www.admin.gwan.com.br",
      ],
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    });

    // Configuração do Swagger
    const config = new DocumentBuilder()
      .setTitle("GWAN API")
      .setDescription("API do sistema GWAN")
      .setVersion("1.0")
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

    app.useGlobalPipes(new ValidationPipe());

    const port = configService.get<number>("PORT") || 3000;
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
