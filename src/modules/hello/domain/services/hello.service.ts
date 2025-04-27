import { Injectable, Inject } from '@nestjs/common';
import { Hello } from '../entities/hello.entity';
import { IHelloRepository } from '../repositories/hello.repository';
import { BaseService } from '../../../../core/domain/services/base.service';
import { HELLO_REPOSITORY } from '../tokens/hello.tokens';

@Injectable()
export class HelloService extends BaseService<Hello> {
  constructor(
    @Inject(HELLO_REPOSITORY)
    protected readonly repository: IHelloRepository
  ) {
    super(repository);
  }

  async getHelloMessage(): Promise<string> {
    return 'Hello World!';
  }
} 