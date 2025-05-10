import { Injectable, Logger, Inject } from '@nestjs/common';
import { Multer } from 'multer';
import { IStorageService } from '../../domain/services/storage.service.interface';
import { IBucketFileRepository } from '../../domain/repositories/bucket-file.repository';
import { FileUploadResult } from '../dtos/file-result.dto';
import { Types } from 'mongoose';
import { STORAGE_SERVICE, BUCKET_FILE_REPOSITORY } from '../../domain/constants/injection-tokens';
import { FileStatus } from '../../domain/entities/bucket-file.entity';

@Injectable()
export class UploadFileUseCase {
    private readonly logger = new Logger(UploadFileUseCase.name);

    constructor(
        @Inject(STORAGE_SERVICE)
        private readonly storageService: IStorageService,
        @Inject(BUCKET_FILE_REPOSITORY)
        private readonly bucketFileRepository: IBucketFileRepository,
    ) { }

    async execute(file: Multer['File'], userId: string, knowledgeBaseId?: string): Promise<FileUploadResult> {
        this.logger.debug(`[UploadFile] Iniciando upload para usuário: ${userId}`);

        // Cria o nome do objeto incluindo o diretório do usuário e knowledgeBaseId se fornecido
        const objectName = knowledgeBaseId
            ? `${userId}/${knowledgeBaseId}/${Date.now()}-${file.originalname}`
            : `${userId}/${Date.now()}-${file.originalname}`;

        // Faz upload do arquivo
        await this.storageService.uploadFile(file, objectName);

        // Gera URL temporária para o arquivo
        const url = await this.storageService.getFileUrl(objectName);

        // Armazena informações do arquivo no MongoDB
        const bucketFile = await this.bucketFileRepository.create({
            userId: new Types.ObjectId(userId),
            originalName: file.originalname,
            fileName: objectName,
            size: file.size,
            mimeType: file.mimetype,
            url,
            bucketName: 'datasets',
            knowledgeBaseId: knowledgeBaseId ? new Types.ObjectId(knowledgeBaseId) : undefined,
            status: 'available' as FileStatus,
        });

        this.logger.debug(`[UploadFile] Upload concluído com sucesso: ${bucketFile.id}`);

        return {
            id: bucketFile.id,
            originalname: file.originalname,
            filename: objectName,
            size: file.size,
            mimetype: file.mimetype,
            url,
            knowledgeBaseId,
            status: bucketFile.status,
        };
    }
}