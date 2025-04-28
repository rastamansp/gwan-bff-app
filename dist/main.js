"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
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
}
bootstrap();
//# sourceMappingURL=main.js.map