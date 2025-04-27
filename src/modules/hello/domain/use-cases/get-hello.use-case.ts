import { Injectable } from '@nestjs/common';
import { Hello } from '../entities/hello.entity';
import { HelloService } from '../services/hello.service';
import { BaseUseCase } from '../../../../core/domain/use-cases/base.use-case';

@Injectable()
export class GetHelloUseCase extends BaseUseCase<Hello> {
  constructor(private readonly helloService: HelloService) {
    super(helloService);
  }

  async execute(): Promise<string> {
    return this.helloService.getHelloMessage();
  }
} 