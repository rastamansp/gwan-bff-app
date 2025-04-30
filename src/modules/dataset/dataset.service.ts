import { Injectable, Logger, InternalServerErrorException, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { BucketFile } from './domain/entities/bucket-file.entity';
import { IBucketFileRepository } from './domain/repositories/bucket-file.repository';

@Injectable()
export class DatasetService {
    private readonly minioClient: Minio.Client;
    private readonly logger = new Logger(DatasetService.name);
    private readonly bucketName = 'datasets';

    constructor(
        private configService: ConfigService,
        @Inject('IBucketFileRepository')
        private readonly bucketFileRepository: IBucketFileRepository
    ) {
        // Basic MinIO configuration
        const minioConfig = {
            endPoint: this.configService.get<string>('MINIO_ENDPOINT'),
            port: Number(this.configService.get<string>('MINIO_PORT')),
            useSSL: this.configService.get<string>('MINIO_USE_SSL') === 'true',
            accessKey: this.configService.get<string>('MINIO_ACCESS_KEY'),
            secretKey: this.configService.get<string>('MINIO_SECRET_KEY'),
        };

        this.logger.log('Initializing MinIO client with config:', {
            endPoint: minioConfig.endPoint,
            port: minioConfig.port,
            useSSL: minioConfig.useSSL,
            accessKey: minioConfig.accessKey,
            secretKey: minioConfig.secretKey
        });

        this.minioClient = new Minio.Client(minioConfig);
    }

    async listBucketContents(userId: string) {
        try {
            const exists = await this.minioClient.bucketExists(this.bucketName);
            if (!exists) {
                throw new InternalServerErrorException(`Bucket ${this.bucketName} não encontrado. Por favor, crie o bucket no console do MinIO.`);
            }

            this.logger.debug('Listando conteúdo do bucket...');

            // Get files from MongoDB for the specific user
            const bucketFiles = await this.bucketFileRepository.findByUserId(userId);

            // Get additional metadata from MinIO for user's directory
            const objects: any[] = [];
            const userPrefix = `${userId}/`;
            const stream = this.minioClient.listObjects(this.bucketName, userPrefix, true);

            return new Promise((resolve, reject) => {
                stream.on('data', (obj) => {
                    const bucketFile = bucketFiles.find(bf => bf.fileName === obj.name);
                    if (bucketFile) {
                        objects.push({
                            id: bucketFile.id,
                            name: obj.name,
                            size: obj.size,
                            lastModified: obj.lastModified,
                            etag: obj.etag,
                            originalName: bucketFile.originalName,
                            mimeType: bucketFile.mimeType,
                            url: bucketFile.url
                        });
                    }
                });

                stream.on('end', () => {
                    this.logger.debug(`Encontrados ${objects.length} objetos no bucket para o usuário ${userId}`);
                    resolve(objects);
                });

                stream.on('error', (err: any) => {
                    this.logger.error('Erro ao listar conteúdo do bucket:', {
                        error: err,
                        message: err.message,
                        code: err.code,
                        statusCode: err.statusCode
                    });
                    reject(new InternalServerErrorException('Falha ao listar conteúdo do bucket'));
                });
            });
        } catch (error: any) {
            this.logger.error('Erro inesperado ao listar conteúdo do bucket:', {
                error: error,
                message: error.message,
                code: error.code,
                statusCode: error.statusCode
            });
            throw new InternalServerErrorException(error.message || 'Ocorreu um erro inesperado ao listar o conteúdo do bucket');
        }
    }

    async handleFileUpload(file: Express.Multer.File, userId: string) {
        try {
            // Verifica se o bucket existe antes de tentar fazer upload
            const exists = await this.minioClient.bucketExists(this.bucketName);
            if (!exists) {
                throw new InternalServerErrorException(`Bucket ${this.bucketName} não encontrado. Por favor, crie o bucket no console do MinIO.`);
            }

            // Cria o nome do objeto incluindo o diretório do usuário
            const objectName = `${userId}/${Date.now()}-${file.originalname}`;
            const fileBuffer = file.buffer;

            if (!fileBuffer) {
                throw new InternalServerErrorException('Arquivo inválido ou corrompido');
            }

            this.logger.debug('Fazendo upload do arquivo...', {
                filename: file.originalname,
                size: file.size,
                mimetype: file.mimetype,
                objectName: objectName
            });

            await this.minioClient.putObject(
                this.bucketName,
                objectName,
                fileBuffer,
                file.size,
                { 'Content-Type': file.mimetype }
            );

            this.logger.debug('Upload do arquivo concluído com sucesso');

            // Gera URL temporária para o arquivo
            const url = await this.minioClient.presignedGetObject(
                this.bucketName,
                objectName,
                24 * 60 * 60 // URL válida por 24 horas
            );

            // Store file information in MongoDB
            const bucketFile = await this.bucketFileRepository.create({
                userId,
                originalName: file.originalname,
                fileName: objectName,
                size: file.size,
                mimeType: file.mimetype,
                url,
                bucketName: this.bucketName
            });

            return {
                id: bucketFile.id,
                originalname: file.originalname,
                filename: objectName,
                size: file.size,
                mimetype: file.mimetype,
                url: url
            };
        } catch (error: any) {
            this.logger.error('Erro ao fazer upload do arquivo:', {
                error: error,
                message: error.message,
                code: error.code,
                statusCode: error.statusCode,
                filename: file?.originalname
            });
            throw new InternalServerErrorException(error.message || 'Falha ao fazer upload do arquivo');
        }
    }
} 