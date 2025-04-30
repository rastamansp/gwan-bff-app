import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BucketFile } from '../../domain/entities/bucket-file.entity';
import { IBucketFileRepository } from '../../domain/repositories/bucket-file.repository';

@Injectable()
export class BucketFileRepositoryImpl implements IBucketFileRepository {
    constructor(
        @InjectModel('BucketFile') private readonly bucketFileModel: Model<BucketFile>
    ) { }

    async findById(id: string): Promise<BucketFile | null> {
        return this.bucketFileModel.findById(id).exec();
    }

    async findAll(): Promise<BucketFile[]> {
        return this.bucketFileModel.find().exec();
    }

    async create(data: Partial<BucketFile>): Promise<BucketFile> {
        const bucketFile = new this.bucketFileModel(data);
        return bucketFile.save();
    }

    async update(id: string, data: Partial<BucketFile>): Promise<BucketFile> {
        return this.bucketFileModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async delete(id: string): Promise<void> {
        await this.bucketFileModel.findByIdAndDelete(id).exec();
    }

    async findByUserId(userId: string): Promise<BucketFile[]> {
        return this.bucketFileModel.find({ userId }).exec();
    }
} 