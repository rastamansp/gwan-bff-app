import { Controller, Get } from '@nestjs/common';
import { GetHelloUseCase } from '../../domain/use-cases/get-hello.use-case';

@Controller('hello')
export class HelloController {
  constructor(private readonly getHelloUseCase: GetHelloUseCase) {}

  @Get()
  async getHello(): Promise<string> {
    return this.getHelloUseCase.execute();
  }
} 