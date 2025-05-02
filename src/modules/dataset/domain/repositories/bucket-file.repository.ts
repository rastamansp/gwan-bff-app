import { BucketFile } from "../entities/bucket-file.entity";
import { IBaseRepository } from "../../../../core/domain/repositories/base.repository";

export interface IBucketFileRepository extends IBaseRepository<BucketFile> {
  findByUserId(userId: string): Promise<BucketFile[]>;
}
