import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BucketFile, FileStatus } from '../../domain/entities/bucket-file.entity';
import { IBucketFileRepository, BucketFile as IBucketFile } from '../../domain/repositories/bucket-file.repository.interface';

@Injectable()
export class BucketFileRepositoryImpl implements IBucketFileRepository {
  private readonly logger = new Logger(BucketFileRepositoryImpl.name);

  constructor(
    @InjectModel(BucketFile.name)
    private readonly bucketFileModel: Model<BucketFile>,
  ) { }

  async create(data: Partial<IBucketFile>): Promise<IBucketFile> {
    const bucketFile = new this.bucketFileModel({
      ...data,
      userId: new Types.ObjectId(data.userId),
      knowledgeBaseId: data.knowledgeBaseId ? new Types.ObjectId(data.knowledgeBaseId) : undefined,
    });
    const saved = await bucketFile.save();
    return this.toInterface(saved);
  }

  async findById(id: string): Promise<IBucketFile | null> {
    const bucketFile = await this.bucketFileModel.findById(id).exec();
    return bucketFile ? this.toInterface(bucketFile) : null;
  }

  async findByUserId(userId: string): Promise<IBucketFile[]> {
    const bucketFiles = await this.bucketFileModel
      .find({ userId: new Types.ObjectId(userId) })
      .exec();
    return bucketFiles.map(this.toInterface);
  }

  async findByKnowledgeBaseId(knowledgeBaseId: string): Promise<IBucketFile[]> {
    const bucketFiles = await this.bucketFileModel
      .find({ knowledgeBaseId: new Types.ObjectId(knowledgeBaseId) })
      .exec();
    return bucketFiles.map(this.toInterface);
  }

  async findByStatus(status: FileStatus): Promise<IBucketFile[]> {
    const bucketFiles = await this.bucketFileModel
      .find({ status })
      .exec();
    return bucketFiles.map(this.toInterface);
  }

  async findByUserIdAndStatus(userId: string, status: FileStatus): Promise<IBucketFile[]> {
    const bucketFiles = await this.bucketFileModel
      .find({
        userId: new Types.ObjectId(userId),
        status
      })
      .exec();
    return bucketFiles.map(this.toInterface);
  }

  async update(id: string, data: Partial<IBucketFile>): Promise<IBucketFile | null> {
    const bucketFile = await this.bucketFileModel
      .findByIdAndUpdate(
        id,
        {
          ...data,
          userId: data.userId ? new Types.ObjectId(data.userId) : undefined,
          knowledgeBaseId: data.knowledgeBaseId ? new Types.ObjectId(data.knowledgeBaseId) : undefined,
        },
        { new: true },
      )
      .exec();
    return bucketFile ? this.toInterface(bucketFile) : null;
  }

  async updateMany(files: Partial<IBucketFile>[]): Promise<void> {
    const operations = files.map(file => {
      const updateData = {
        ...file,
        userId: file.userId ? new Types.ObjectId(file.userId) : undefined,
        knowledgeBaseId: file.knowledgeBaseId ? new Types.ObjectId(file.knowledgeBaseId) : undefined,
      };

      if (file.id) {
        return this.bucketFileModel.findByIdAndUpdate(file.id, updateData, { new: true }).exec();
      } else {
        return this.bucketFileModel.create(updateData);
      }
    });

    await Promise.all(operations);
  }

  async delete(id: string): Promise<void> {
    await this.bucketFileModel.findByIdAndDelete(id).exec();
  }

  async deleteMany(ids: string[]): Promise<void> {
    await this.bucketFileModel.deleteMany({ _id: { $in: ids } }).exec();
  }

  private toInterface(bucketFile: BucketFile): IBucketFile {
    return {
      id: bucketFile._id.toString(),
      userId: bucketFile.userId,
      originalName: bucketFile.originalName,
      fileName: bucketFile.fileName,
      size: bucketFile.size,
      mimeType: bucketFile.mimeType,
      url: bucketFile.url,
      bucketName: bucketFile.bucketName,
      knowledgeBaseId: bucketFile.knowledgeBaseId,
      status: bucketFile.status,
      processingError: bucketFile.processingError,
      lastModified: bucketFile.lastModified,
      createdAt: bucketFile.createdAt,
      updatedAt: bucketFile.updatedAt,
    };
  }
}
