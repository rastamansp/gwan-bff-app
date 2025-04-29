"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const mongoose = require("mongoose");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    try {
        mongoose.connection.on('connected', async () => {
            logger.log('[MongoDB] Conexão estabelecida com sucesso');
            try {
                const db = mongoose.connection.db;
                const result = await db.command({ connectionStatus: 1 });
                logger.log('[MongoDB] Usuário autenticado:', result?.authInfo?.authenticatedUsers?.[0]?.user || 'não disponível');
            }
            catch (err) {
                logger.error('[MongoDB] Erro ao obter status da conexão:', err);
            }
        });
        mongoose.connection.on('error', (err) => {
            logger.error('[MongoDB] Erro na conexão:', err);
        });
        mongoose.connection.on('disconnected', () => {
            logger.log('[MongoDB] Desconectado');
        });
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        const configService = app.get(config_1.ConfigService);
        app.enableCors({
            origin: [
                'http://localhost:5173',
                'http://localhost:5174',
                'https://bff.gwan.com.br',
                'https://www.bff.gwan.com.br',
                'https://admin.gwan.com.br',
                'https://www.admin.gwan.com.br'
            ],
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true,
        });
        const config = new swagger_1.DocumentBuilder()
            .setTitle('Gwan BFF API')
            .setDescription('Backend for Frontend API for Gwan application')
            .setVersion('1.0')
            .addTag('auth', 'Authentication endpoints')
            .addBearerAuth()
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api', app, document);
        await app.listen(3000);
        logger.log('Aplicação iniciada na porta 3000');
    }
    catch (error) {
        logger.error('Erro ao iniciar a aplicação:', error);
        process.exit(1);
    }
}
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
bootstrap();
//# sourceMappingURL=main.js.map