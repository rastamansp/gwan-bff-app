import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { MongooseModule } from "@nestjs/mongoose";
import { DatasetController } from "./dataset.controller";
import { DatasetService } from "./dataset.service";
import {
  BucketFile,
  BucketFileSchema,
} from "./domain/entities/bucket-file.entity";
import { BucketFileRepositoryImpl } from "./infrastructure/repositories/bucket-file.repository.impl";

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
    DatasetService,
    BucketFileRepositoryImpl,
    {
      provide: "IBucketFileRepository",
      useClass: BucketFileRepositoryImpl,
    },
  ],
  exports: [
    DatasetService,
    MongooseModule.forFeature([
      { name: BucketFile.name, schema: BucketFileSchema },
    ]),
    {
      provide: "IBucketFileRepository",
      useClass: BucketFileRepositoryImpl,
    },
  ],
})
export class DatasetModule { }
