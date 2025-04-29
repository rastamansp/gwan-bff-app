import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloModule } from './modules/hello/hello.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { EmailWorkerModule } from './workers/email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      expandVariables: true,
      cache: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get('MONGODB_URI') || 'mongodb://gwan:pazdeDeus2025@mongodb.gwan.com.br:27017/gwan?authSource=admin';
        return { uri };
      },
      inject: [ConfigService],
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