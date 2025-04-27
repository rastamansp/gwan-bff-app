import { Module } from '@nestjs/common';
import { HelloController } from './infrastructure/controllers/hello.controller';
import { HelloService } from './domain/services/hello.service';
import { GetHelloUseCase } from './domain/use-cases/get-hello.use-case';
import { HelloRepositoryImpl } from './infrastructure/repositories/hello.repository.impl';
import { HELLO_REPOSITORY } from './domain/tokens/hello.tokens';

@Module({
  controllers: [HelloController],
  providers: [
    {
      provide: HELLO_REPOSITORY,
      useClass: HelloRepositoryImpl,
    },
    HelloService,
    GetHelloUseCase,
  ],
})
export class HelloModule {} 