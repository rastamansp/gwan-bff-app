import { GetHelloUseCase } from '../../domain/use-cases/get-hello.use-case';
export declare class HelloController {
    private readonly getHelloUseCase;
    constructor(getHelloUseCase: GetHelloUseCase);
    getHello(): Promise<string>;
}
