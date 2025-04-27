import { BaseEntity } from '../entities/base.entity';
import { BaseService } from '../services/base.service';

export abstract class BaseUseCase<T extends BaseEntity> {
  constructor(protected readonly service: BaseService<T>) {}
} 