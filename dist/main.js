"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const mongoose = require("mongoose");
const config_1 = require("@nestjs/config");
const http_exception_filter_1 = require("./shared/filters/http-exception.filter");
const logging_interceptor_1 = require("./shared/interceptors/logging.interceptor");
const env_validation_1 = require("./config/env.validation");
function printRoutesInfo() {
    const logger = new common_1.Logger('Routes');
    const baseUrl = process.env.API_URL;
    logger.log('=== Informações da API ===');
    logger.log(`Swagger: ${baseUrl}/api`);
    logger.log(`API: ${baseUrl}`);
    logger.log('Rotas por domínio:');
    logger.log('Auth (/auth)');
    logger.log('POST /auth/register - Registro de usuário');
    logger.log('POST /auth/login - Login de usuário');
    logger.log('POST /auth/verify-code - Verificação de código');
    logger.log('POST /auth/verify-login-code - Verificação de código de login');
    logger.log('User (/users)');
    logger.log('GET /users/profile - Obter perfil do usuário');
    logger.log('PUT /users/profile - Atualizar perfil do usuário');
    logger.log('Knowledge (/knowledge)');
    logger.log('GET /knowledge - Listar todo conhecimento');
    logger.log('GET /knowledge/:id - Buscar conhecimento por ID');
    logger.log('GET /knowledge/category/:category - Buscar por categoria');
    logger.log('GET /knowledge/author - Buscar por autor');
    logger.log('GET /knowledge/tags - Buscar por tags');
    logger.log('GET /knowledge/my - Buscar conhecimento do usuário atual');
    logger.log('POST /knowledge - Criar conhecimento');
    logger.log('PUT /knowledge/:id - Atualizar conhecimento');
    logger.log('Dataset (/user/dataset)');
    logger.log('POST /user/dataset - Upload de dataset');
    logger.log('GET /user/dataset - Listar datasets');
    logger.log('GET /user/dataset/:id - Buscar dataset por ID');
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
    const logger = new common_1.Logger("Bootstrap");
    try {
        (0, env_validation_1.validateEnv)();
        mongoose.connection.on("connected", async () => {
            logger.log("[MongoDB] Conexão estabelecida com sucesso");
            try {
                const db = mongoose.connection.db;
                const result = await db.command({ connectionStatus: 1 });
                logger.log("[MongoDB] Detalhes da conexão:", {
                    database: db.databaseName,
                    user: result?.authInfo?.authenticatedUsers?.[0]?.user || "não disponível",
                    host: mongoose.connection.host,
                    port: mongoose.connection.port,
                    name: mongoose.connection.name
                });
            }
            catch (err) {
                logger.error("[MongoDB] Erro ao obter status da conexão:", err);
            }
        });
        mongoose.connection.on("error", (err) => {
            logger.error("[MongoDB] Erro na conexão:", err);
        });
        mongoose.connection.on("disconnected", () => {
            logger.log("[MongoDB] Desconectado");
        });
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        const configService = app.get(config_1.ConfigService);
        app.setGlobalPrefix('api');
        app.enableCors(configService.get('cors'));
        const swaggerConfig = configService.get('swagger') || {
            title: 'GWAN API',
            description: 'API do sistema GWAN',
            version: '1.0'
        };
        const config = new swagger_1.DocumentBuilder()
            .setTitle(swaggerConfig.title)
            .setDescription(swaggerConfig.description)
            .setVersion(swaggerConfig.version)
            .addBearerAuth({
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            name: "JWT",
            description: "Enter JWT token",
            in: "header",
        }, "JWT")
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup("api", app, document);
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
        }));
        app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
        app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor());
        const port = configService.get("port") || 3000;
        await app.listen(port);
        logger.log(`Application is running on: http://localhost:${port}`);
        printRoutesInfo();
    }
    catch (error) {
        logger.error("Erro ao iniciar a aplicação:", error);
        process.exit(1);
    }
}
process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    process.exit(1);
});
bootstrap();
//# sourceMappingURL=main.js.map