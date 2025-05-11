import { Injectable, Logger, Inject, NotFoundException } from '@nestjs/common';
import { IStorageService } from '../../domain/services/storage.service.interface';
import { IBucketFileRepository } from '../../domain/repositories/bucket-file.repository';
import { STORAGE_SERVICE, BUCKET_FILE_REPOSITORY } from '../../domain/constants/injection-tokens';

@Injectable()
export class DeleteFileUseCase {
    private readonly logger = new Logger(DeleteFileUseCase.name);

    constructor(
        @Inject(STORAGE_SERVICE)
        private readonly storageService: IStorageService,
        @Inject(BUCKET_FILE_REPOSITORY)
        private readonly bucketFileRepository: IBucketFileRepository,
    ) { }

    async execute(fileId: string, userId: string): Promise<void> {
        this.logger.log(`Starting file deletion process for file ${fileId}`);

        // Busca o arquivo no repositório
        const bucketFile = await this.bucketFileRepository.findById(fileId);
        if (!bucketFile) {
            throw new NotFoundException(`File with id ${fileId} not found`);
        }

        // Verifica se o arquivo pertence ao usuário
        if (bucketFile.userId.toString() !== userId) {
            throw new NotFoundException(`File with id ${fileId} not found`);
        }

        try {
            // Remove o arquivo do MinIO
            await this.storageService.deleteFile(bucketFile.fileName);
            this.logger.log(`File ${bucketFile.fileName} deleted from MinIO`);

            // Remove o registro do MongoDB
            await this.bucketFileRepository.delete(fileId);
            this.logger.log(`File record ${fileId} deleted from MongoDB`);

        } catch (error) {
            this.logger.error(`Error deleting file ${fileId}:`, error);
            throw error;
        }

        this.logger.log(`File ${fileId} successfully deleted`);
    }
} 