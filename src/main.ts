import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ValidationPipe, Logger } from "@nestjs/common";
import { AppModule } from "./app.module";
import * as mongoose from "mongoose";
import { ConfigService } from "@nestjs/config";
import { HttpExceptionFilter } from "./shared/filters/http-exception.filter";
import { LoggingInterceptor } from "./shared/interceptors/logging.interceptor";
import { validateEnv } from "./config/env.validation";
import { displayVersionInfo, getPackageInfo } from "./utils/version.util";

function printRoutesInfo() {
  const logger = new Logger('Routes');
  const baseUrl = process.env.API_URL || 'http://localhost:3000';
  const packageInfo = getPackageInfo();

  logger.log('=== INFORMÇÕES DA API ===');
  logger.log(`🚀 Versão: ${packageInfo.version}`);
  logger.log(`📦 Nome: ${packageInfo.name}`);
  logger.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  logger.log(`🔗 Swagger: ${baseUrl}/api`);
  logger.log(`🔗 API: ${baseUrl}`);
  logger.log('📋 Rotas por domínio:');

  // App (Root)
  logger.log('\n🏠 App (/)');
  logger.log('GET / - Hello World');

  // Auth
  logger.log('\n🔐 Auth (/auth)');
  logger.log('POST /auth/register - Registro de usuário');
  logger.log('POST /auth/login - Login de usuário');
  logger.log('POST /auth/verify-code - Verificação de código');
  logger.log('POST /auth/verify-login-code - Verificação de código de login');

  // Hello
  logger.log('\n👋 Hello (/hello)');
  logger.log('GET /hello - Mensagem de boas-vindas');

  // Health
  logger.log('\n💚 Health (/health)');
  logger.log('GET /health - Verificação de saúde da aplicação');
  logger.log('GET /health/version - Informações de versão da aplicação');

  // Users
  logger.log('\n👥 Users (/users)');
  logger.log('GET /users - Listar todos os usuários');
  logger.log('GET /users/:id - Buscar usuário por ID');
  logger.log('PUT /users/:id - Atualizar usuário');

  // Profile
  logger.log('\n👤 Profile (/profile)');
  logger.log('GET /profile - Obter perfil do usuário');
  logger.log('PUT /profile - Atualizar perfil do usuário');

  // User Profile
  logger.log('\n👤 User Profile (/user/profile)');
  logger.log('GET /user/profile - Obter perfil do usuário autenticado');
  logger.log('PATCH /user/profile - Atualizar perfil do usuário');

  // Knowledge (Public)
  logger.log('\n📚 Knowledge (/knowledge)');
  logger.log('GET /knowledge - Listar todo conhecimento');
  logger.log('GET /knowledge/:id - Buscar conhecimento por ID');
  logger.log('GET /knowledge/category/:category - Buscar por categoria');
  logger.log('GET /knowledge/author - Buscar por autor');
  logger.log('GET /knowledge/tags - Buscar por tags');
  logger.log('GET /knowledge/my - Buscar conhecimento do usuário atual');
  logger.log('POST /knowledge - Criar conhecimento');
  logger.log('PUT /knowledge/:id - Atualizar conhecimento');

  // User Knowledge
  logger.log('\n📚 User Knowledge (/user/knowledge)');
  logger.log('POST /user/knowledge - Criar conhecimento do usuário');
  logger.log('GET /user/knowledge - Listar conhecimento do usuário');
  logger.log('GET /user/knowledge/:id - Buscar conhecimento por ID');
  logger.log('DELETE /user/knowledge/:id - Deletar conhecimento');
  logger.log('POST /user/knowledge/:knowledgeBaseId/start-process/:bucketFileId - Iniciar processamento');
  logger.log('POST /user/knowledge/:knowledgeBaseId/similar - Buscar similaridades');
  logger.log('PATCH /user/knowledge/:knowledgeBaseId/chunks/:chunkId/status - Atualizar status do chunk');
  logger.log('DELETE /user/knowledge/:knowledgeBaseId/chunks/:chunkId - Deletar chunk');
  logger.log('PATCH /user/knowledge/:knowledgeBaseId/chunks/:chunkId/content - Atualizar conteúdo do chunk');

  // Dataset
  logger.log('\n📁 Dataset (/user/datasets)');
  logger.log('POST /user/datasets/upload - Upload de dataset');
  logger.log('POST /user/datasets/:datasetId/documents - Adicionar documentos ao dataset');
  logger.log('GET /user/datasets/files - Listar arquivos');
  logger.log('GET /user/datasets/:datasetId/documents - Listar documentos do dataset');
  logger.log('DELETE /user/datasets/files/:id - Deletar arquivo');
  logger.log('DELETE /user/datasets/:datasetId/documents/:documentId - Deletar documento');

  // Crawling
  logger.log('\n🕷️  Crawling (/user/crawling)');
  logger.log('POST /user/crawling - Criar solicitação de crawling');
  logger.log('GET /user/crawling - Listar solicitações de crawling');
  logger.log('GET /user/crawling/:id - Buscar solicitação de crawling por ID');

  // Chatbots
  logger.log('\n🤖 Chatbots (/chatbots)');
  logger.log('POST /chatbots - Criar chatbot');
  logger.log('GET /chatbots - Listar chatbots');
  logger.log('PUT /chatbots/:id - Atualizar chatbot');
  logger.log('PUT /chatbots/:id/n8n-config - Atualizar configuração N8N');
  logger.log('PUT /chatbots/:id/vector-config - Atualizar configuração de vetores');
  logger.log('PUT /chatbots/:id/status - Atualizar status do chatbot');
  logger.log('DELETE /chatbots/:id - Deletar chatbot');

  logger.log('\n📝 Observações:');
  logger.log('- Todas as rotas (exceto /auth/*, /health, /hello e /) requerem autenticação JWT');
  logger.log('- A documentação completa está disponível no Swagger UI');
  logger.log('- As rotas estão organizadas por domínio seguindo princípios de Clean Architecture');
  logger.log('- Cada rota possui validação de DTOs e tratamento de erros');
  logger.log('- As respostas são padronizadas e documentadas com Swagger');
  logger.log(`- Maiores detalhes acesse ${baseUrl}/api`);
  logger.log('================================\n');
}

async function bootstrap() {
  const logger = new Logger("Bootstrap");

  try {
    // Exibir informações de versão
    displayVersionInfo();

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

    // Configurar nomes únicos para schemas e evitar conflitos
    if (document.components && document.components.schemas) {
      const schemas = document.components.schemas;
      const newSchemas = {};
      const usedNames = new Set();

      Object.keys(schemas).forEach(key => {
        const schema = schemas[key];
        if (schema && typeof schema === 'object') {
          // Garantir que cada schema tenha um nome único e descritivo
          let newKey = key;

          // Se o nome for muito curto ou já foi usado, criar um nome único
          if (key.length <= 2 || usedNames.has(key)) {
            newKey = `Schema_${key}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          }

          // Se ainda houver conflito, adicionar prefixo
          if (usedNames.has(newKey)) {
            newKey = `Unique_${newKey}`;
          }

          usedNames.add(newKey);
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
