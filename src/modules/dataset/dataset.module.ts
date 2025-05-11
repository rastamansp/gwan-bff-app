import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { MongooseModule } from "@nestjs/mongoose";
import { DatasetController } from "./presentation/controllers/dataset.controller";
import { UploadFileUseCase } from "./application/use-cases/upload-file.use-case";
import { ListFilesUseCase } from "./application/use-cases/list-files.use-case";
import { DeleteFileUseCase } from "./application/use-cases/delete-file.use-case";
import { MinioStorageService } from "./infrastructure/storage/minio-storage.service";
import {
  BucketFile,
  BucketFileSchema,
} from "./domain/entities/bucket-file.entity";
import { BucketFileRepositoryImpl } from "./infrastructure/repositories/bucket-file.repository.impl";
import { STORAGE_SERVICE, BUCKET_FILE_REPOSITORY } from "./domain/constants/injection-tokens";
import { DatasetService } from "./dataset.service";

@Module({
  imports: [
    MulterModule.register({
      dest: "./datasets",
    }),
    MongooseModule.forFeature([
      { name: BucketFile.name, schema: BucketFileSchema },
    ]),
  ],
  controllers: [DatasetController],
  providers: [
    {
      provide: STORAGE_SERVICE,
      useClass: MinioStorageService,
    },
    {
      provide: BUCKET_FILE_REPOSITORY,
      useClass: BucketFileRepositoryImpl,
    },
    UploadFileUseCase,
    ListFilesUseCase,
    DeleteFileUseCase,
    MinioStorageService,
    BucketFileRepositoryImpl,
    DatasetService,
  ],
  exports: [
    UploadFileUseCase,
    ListFilesUseCase,
    DeleteFileUseCase,
    MinioStorageService,
    DatasetService,
    {
      provide: STORAGE_SERVICE,
      useClass: MinioStorageService,
    },
    {
      provide: BUCKET_FILE_REPOSITORY,
      useClass: BucketFileRepositoryImpl,
    },
  ],
})
export class DatasetModule { }
