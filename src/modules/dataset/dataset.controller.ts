import { Controller, Post, UploadedFile, UseInterceptors, Get } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DatasetService } from './dataset.service';
import { Express } from 'express';
import { memoryStorage } from 'multer';

@Controller('user/dataset')
export class DatasetController {
    constructor(private readonly datasetService: DatasetService) { }

    @Get('list')
    async listFiles() {
        return this.datasetService.listBucketContents();
    }

    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage(),
            fileFilter: (req, file, callback) => {
                if (file.mimetype !== 'application/pdf') {
                    return callback(new Error('Apenas arquivos PDF são permitidos!'), false);
                }
                callback(null, true);
            },
            limits: {
                fileSize: 5 * 1024 * 1024, // 5MB
            }
        }),
    )
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new Error('Nenhum arquivo foi enviado');
        }
        return this.datasetService.handleFileUpload(file);
    }
} 