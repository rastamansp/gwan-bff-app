import { Hello } from "../entities/hello.entity";
import { IHelloRepository } from "../repositories/hello.repository";
import { BaseService } from "../../../../core/domain/services/base.service";
export declare class HelloService extends BaseService<Hello> {
    protected readonly repository: IHelloRepository;
    constructor(repository: IHelloRepository);
    getHelloMessage(): Promise<string>;
}
