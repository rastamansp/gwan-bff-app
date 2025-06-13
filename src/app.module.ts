import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { HelloModule } from "./modules/hello/hello.module";
import { AuthModule } from "./modules/auth/auth.module";
import { HealthModule } from "./modules/health/health.module";
import { EmailWorkerModule } from "./workers/email/email.module";
import { DatasetModule } from "./modules/dataset/dataset.module";
import { KnowledgeModule } from "./modules/knowledge/knowledge.module";
import { RabbitMQModule } from './modules/rabbitmq/rabbitmq.module';
import { UsersModule } from "./modules/users/users.module";
import { ProfileModule } from './modules/profile/profile.module';
import { CrawlModule } from './modules/crawl/crawl.module';
import configuration from './config/configuration';
import { ChatbotsModule } from './modules/chatbots/chatbots.module';
import * as fs from 'fs';
import * as path from 'path';

function getEnvFilePath(): string {
  const nodeEnv = process.env.NODE_ENV || 'development';

  const envFiles = [
    `.env.${nodeEnv}`,
    '.env'
  ];

  for (const envFile of envFiles) {
    if (fs.existsSync(path.resolve(process.cwd(), envFile))) {
      return envFile;
    }
  }

  // Se nenhum arquivo for encontrado, retorna null para usar apenas variáveis de ambiente
  return null;
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvFilePath(),
      expandVariables: true,
      cache: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get("database.uri");
        return { uri };
      },
      inject: [ConfigService],
    }),
    HelloModule,
    AuthModule,
    HealthModule,
    EmailWorkerModule,
    DatasetModule,
    KnowledgeModule,
    RabbitMQModule,
    UsersModule,
    ProfileModule,
    ChatbotsModule,
    CrawlModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
