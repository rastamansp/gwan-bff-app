import { BucketFile, FileStatus } from '../entities/bucket-file.entity';

export interface IBucketFileRepository {
  create(data: Partial<BucketFile>): Promise<BucketFile>;
  findById(id: string): Promise<BucketFile | null>;
  findByUserId(userId: string): Promise<BucketFile[]>;
  findByKnowledgeBaseId(knowledgeBaseId: string): Promise<BucketFile[]>;
  findByStatus(status: FileStatus): Promise<BucketFile[]>;
  findByUserIdAndStatus(userId: string, status: FileStatus): Promise<BucketFile[]>;
  update(id: string, data: Partial<BucketFile>): Promise<BucketFile | null>;
  updateMany(files: Partial<BucketFile>[]): Promise<void>;
  delete(id: string): Promise<void>;
  deleteMany(ids: string[]): Promise<void>;
}
