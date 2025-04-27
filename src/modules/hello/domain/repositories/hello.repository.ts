import { Hello } from '../entities/hello.entity';
import { IBaseRepository } from '../../../../core/domain/repositories/base.repository';

export interface IHelloRepository extends IBaseRepository<Hello> {} 