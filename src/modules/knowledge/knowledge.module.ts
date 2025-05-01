import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { KnowledgeController } from './knowledge.controller';
import { KnowledgeService } from './knowledge.service';
import { KnowledgeBase, KnowledgeBaseSchema } from './domain/entities/knowledge-base.entity';
import { AuthModule } from '../auth/auth.module';
import { DatasetService } from './infrastructure/services/dataset.service';
import { BucketFile, BucketFileSchema } from './domain/entities/bucket-file.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: KnowledgeBase.name, schema: KnowledgeBaseSchema },
            { name: BucketFile.name, schema: BucketFileSchema },
        ]),
        AuthModule,
    ],
    controllers: [KnowledgeController],
    providers: [KnowledgeService, DatasetService],
    exports: [KnowledgeService, DatasetService],
})
export class KnowledgeModule { } 