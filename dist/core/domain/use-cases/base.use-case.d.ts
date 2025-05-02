import { BaseEntity } from "../entities/base.entity";
import { BaseService } from "../services/base.service";
export declare abstract class BaseUseCase<T extends BaseEntity> {
    protected readonly service: BaseService<T>;
    constructor(service: BaseService<T>);
}
