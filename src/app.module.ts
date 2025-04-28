import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloModule } from './modules/hello/hello.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { EmailWorkerModule } from './workers/email/email.module';

// Função para extrair usuário da URI do MongoDB
function extractMongoUser(uri: string): string {
  try {
    const matches = uri.match(/mongodb:\/\/([^:]+):/);
    return matches ? matches[1] : 'não encontrado';
  } catch (error) {
    return 'erro ao extrair';
  }
}

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => {
        // Usando a URL do MongoDB de produção
        const uri = process.env.MONGODB_URI || 'mongodb://gwan:pazdeDeus2025@mongodb.gwan.com.br:27017/gwan?authSource=admin';
        console.log(process.env.MONGODB_URI)
        return { uri };
      },
    }),
    HelloModule,
    AuthModule,
    HealthModule,
    EmailWorkerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {} 