import { Injectable, Logger, Inject } from '@nestjs/common';
import { IStorageService } from '../../domain/services/storage.service.interface';
import { IBucketFileRepository } from '../../domain/repositories/bucket-file.repository';
import { FileListResult } from '../dtos/file-result.dto';
import { STORAGE_SERVICE, BUCKET_FILE_REPOSITORY } from '../../domain/constants/injection-tokens';
import { BucketFile, FileStatus } from '../../domain/entities/bucket-file.entity';
import { Types } from 'mongoose';

@Injectable()
export class ListFilesUseCase {
    private readonly logger = new Logger(ListFilesUseCase.name);

    constructor(
        @Inject(STORAGE_SERVICE)
        private readonly storageService: IStorageService,
        @Inject(BUCKET_FILE_REPOSITORY)
        private readonly bucketFileRepository: IBucketFileRepository,
    ) { }

    async execute(userId: string): Promise<FileListResult[]> {
        this.logger.debug(`[ListFiles] Sincronizando arquivos do usuário: ${userId}`);

        // Obtém arquivos do MongoDB para o usuário específico
        const bucketFiles = await this.bucketFileRepository.findByUserId(userId);
        const userPrefix = `${userId}/`;

        // Obtém metadados do MinIO para o diretório do usuário
        const minioObjects = await this.storageService.listFiles(userPrefix);

        // Mapeia os arquivos para fácil manipulação
        const minioFilesMap = new Map(
            minioObjects.map(obj => [obj.name, obj])
        );
        const bucketFilesMap = new Map(
            bucketFiles.map(bf => [bf.fileName, bf])
        );

        // Listas para atualização
        const filesToUpdate: Partial<BucketFile>[] = [];
        const filesToDelete: string[] = [];

        // Verifica arquivos que existem no MongoDB mas não no MinIO
        for (const [fileName, bucketFile] of bucketFilesMap) {
            if (!minioFilesMap.has(fileName)) {
                filesToDelete.push(bucketFile.id);
                this.logger.debug(`[ListFiles] Arquivo ${fileName} existe no MongoDB mas não no MinIO. Marcado para remoção.`);
            }
        }

        // Verifica arquivos que existem no MinIO mas não no MongoDB ou precisam ser atualizados
        for (const [fileName, minioObj] of minioFilesMap) {
            const bucketFile = bucketFilesMap.get(fileName);
            const fileUrl = await this.storageService.getFileUrl(fileName);

            if (!bucketFile) {
                // Arquivo existe no MinIO mas não no MongoDB - criar novo registro
                filesToUpdate.push({
                    userId: new Types.ObjectId(userId),
                    fileName: fileName,
                    originalName: fileName.split('/').pop() || fileName,
                    mimeType: minioObj.mimeType || 'application/octet-stream',
                    size: minioObj.size,
                    url: fileUrl,
                    bucketName: 'datasets',
                    status: 'available' as FileStatus,
                    lastModified: minioObj.lastModified,
                });
                this.logger.debug(`[ListFiles] Arquivo ${fileName} existe no MinIO mas não no MongoDB. Marcado para criação.`);
            } else if (
                bucketFile.size !== minioObj.size ||
                bucketFile.lastModified !== minioObj.lastModified ||
                bucketFile.url !== fileUrl
            ) {
                // Arquivo existe em ambos mas precisa ser atualizado
                filesToUpdate.push({
                    ...bucketFile,
                    size: minioObj.size,
                    lastModified: minioObj.lastModified,
                    url: fileUrl,
                    status: bucketFile.status === 'error' ? 'available' as FileStatus : bucketFile.status,
                });
                this.logger.debug(`[ListFiles] Arquivo ${fileName} precisa ser atualizado no MongoDB.`);
            }
        }

        // Executa as atualizações no MongoDB
        if (filesToDelete.length > 0) {
            await this.bucketFileRepository.deleteMany(filesToDelete);
            this.logger.debug(`[ListFiles] Removidos ${filesToDelete.length} arquivos do MongoDB.`);
        }

        if (filesToUpdate.length > 0) {
            await this.bucketFileRepository.updateMany(filesToUpdate);
            this.logger.debug(`[ListFiles] Atualizados ${filesToUpdate.length} arquivos no MongoDB.`);
        }

        // Obtém a lista atualizada de arquivos disponíveis para processamento
        const availableFiles = await this.bucketFileRepository.findByUserIdAndStatus(userId, 'available');
        const processingFiles = await this.bucketFileRepository.findByUserIdAndStatus(userId, 'processing');
        const processedFiles = await this.bucketFileRepository.findByUserIdAndStatus(userId, 'processed');
        const errorFiles = await this.bucketFileRepository.findByUserIdAndStatus(userId, 'error');

        // Combina todos os arquivos com seus respectivos status
        const allFiles = [...availableFiles, ...processingFiles, ...processedFiles, ...errorFiles];

        // Mapeia para o formato de resposta
        const files = allFiles.map(bf => {
            const minioObj = minioFilesMap.get(bf.fileName);
            if (minioObj) {
                return {
                    id: bf.id,
                    name: bf.fileName,
                    size: bf.size,
                    lastModified: bf.lastModified,
                    etag: minioObj.etag,
                    originalName: bf.originalName,
                    mimeType: bf.mimeType,
                    url: bf.url,
                    status: bf.status,
                    processingError: bf.processingError,
                };
            }
            return null;
        }).filter(Boolean);

        this.logger.debug(`[ListFiles] Sincronização concluída. Total de arquivos: ${files.length}`);
        this.logger.debug(`[ListFiles] Status: ${availableFiles.length} disponíveis, ${processingFiles.length} em processamento, ${processedFiles.length} processados, ${errorFiles.length} com erro`);

        return files;
    }
} 