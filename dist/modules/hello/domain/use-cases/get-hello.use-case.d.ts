import { Hello } from '../entities/hello.entity';
import { HelloService } from '../services/hello.service';
import { BaseUseCase } from '../../../../core/domain/use-cases/base.use-case';
export declare class GetHelloUseCase extends BaseUseCase<Hello> {
    private readonly helloService;
    constructor(helloService: HelloService);
    execute(): Promise<string>;
}
