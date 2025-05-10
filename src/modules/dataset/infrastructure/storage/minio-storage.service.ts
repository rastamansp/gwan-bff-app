import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { Multer } from 'multer';
import { IStorageService } from '../../domain/services/storage.service.interface';

@Injectable()
export class MinioStorageService implements IStorageService {
    private readonly minioClient: Minio.Client;
    private readonly logger = new Logger(MinioStorageService.name);
    private readonly bucketName = 'datasets';

    constructor(private readonly configService: ConfigService) {
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
            secretKey: minioConfig.secretKey,
        });

        this.minioClient = new Minio.Client(minioConfig);
    }

    async uploadFile(file: Multer['File'], path: string): Promise<string> {
        const exists = await this.minioClient.bucketExists(this.bucketName);
        if (!exists) {
            throw new Error(`Bucket ${this.bucketName} não encontrado`);
        }

        const fileBuffer = file.buffer;
        if (!fileBuffer) {
            throw new Error('Arquivo inválido ou corrompido');
        }

        await this.minioClient.putObject(
            this.bucketName,
            path,
            fileBuffer,
            file.size,
            { 'Content-Type': file.mimetype },
        );

        return path;
    }

    async listFiles(prefix: string): Promise<any[]> {
        const exists = await this.minioClient.bucketExists(this.bucketName);
        if (!exists) {
            throw new Error(`Bucket ${this.bucketName} não encontrado`);
        }

        const objects: any[] = [];
        const stream = this.minioClient.listObjects(this.bucketName, prefix, true);

        return new Promise((resolve, reject) => {
            stream.on('data', (obj) => {
                objects.push({
                    name: obj.name,
                    size: obj.size,
                    lastModified: obj.lastModified,
                    etag: obj.etag,
                });
            });

            stream.on('end', () => {
                resolve(objects);
            });

            stream.on('error', (err) => {
                this.logger.error('Erro ao listar conteúdo do bucket:', err);
                reject(err);
            });
        });
    }

    async getFileUrl(path: string, expiryInSeconds: number = 24 * 60 * 60): Promise<string> {
        return this.minioClient.presignedGetObject(this.bucketName, path, expiryInSeconds);
    }

    async deleteFile(path: string): Promise<void> {
        await this.minioClient.removeObject(this.bucketName, path);
    }
} 