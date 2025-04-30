import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { DatasetController } from './dataset.controller';
import { DatasetService } from './dataset.service';

@Module({
    imports: [
        MulterModule.register({
            dest: './datasets',
        }),
    ],
    controllers: [DatasetController],
    providers: [DatasetService],
})
export class DatasetModule { } 