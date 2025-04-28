import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as mongoose from 'mongoose';

async function bootstrap() {
  // Adiciona listener para logs do Mongoose
  mongoose.connection.on('connected', async () => {
    console.log('[MongoDB] Conexão estabelecida com sucesso');
    // Tenta obter informações do usuário conectado
    try {
      const db = mongoose.connection.db;
      const result = await db.command({ connectionStatus: 1 });
      console.log('[MongoDB] Usuário autenticado:', result?.authInfo?.authenticatedUsers?.[0]?.user || 'não disponível');
    } catch (err) {
      console.error('[MongoDB] Erro ao obter status da conexão:', err);
    }
  });

  mongoose.connection.on('error', (err) => {
    console.error('[MongoDB] Erro na conexão:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('[MongoDB] Desconectado');
  });

  const app = await NestFactory.create(AppModule);

  // Configuração do CORS
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

  const config = new DocumentBuilder()
    .setTitle('Gwan BFF API')
    .setDescription('Backend for Frontend API for Gwan application')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap(); 