import {
  Injectable,
  Logger,
  InternalServerErrorException,
  Inject,
  BadRequestException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as Minio from "minio";
import { BucketFile, FileStatus } from "./domain/entities/bucket-file.entity";
import { IBucketFileRepository } from "./domain/repositories/bucket-file.repository";
import { Multer } from "multer";
import { Types } from 'mongoose';
import { IStorageService } from './domain/services/storage.service.interface';
import { FileUploadResultDto } from './application/dtos/file-result.dto';
import { STORAGE_SERVICE, BUCKET_FILE_REPOSITORY } from './domain/constants/injection-tokens';
import { DeleteFileUseCase } from "./application/use-cases/delete-file.use-case";

@Injectable()
export class DatasetService {
  private readonly minioClient: Minio.Client;
  private readonly logger = new Logger(DatasetService.name);
  private readonly bucketName = "datasets";

  constructor(
    private configService: ConfigService,
    @Inject(BUCKET_FILE_REPOSITORY)
    private readonly bucketFileRepository: IBucketFileRepository,
    @Inject(STORAGE_SERVICE)
    private readonly storageService: IStorageService,
    private readonly deleteFileUseCase: DeleteFileUseCase,
  ) {
    // Basic MinIO configuration
    const minioConfig = {
      endPoint: this.configService.get<string>("MINIO_ENDPOINT"),
      port: Number(this.configService.get<string>("MINIO_PORT")),
      useSSL: this.configService.get<string>("MINIO_USE_SSL") === "true",
      accessKey: this.configService.get<string>("MINIO_ACCESS_KEY"),
      secretKey: this.configService.get<string>("MINIO_SECRET_KEY"),
    };

    this.logger.log("Initializing MinIO client with config:", {
      endPoint: minioConfig.endPoint,
      port: minioConfig.port,
      useSSL: minioConfig.useSSL,
      accessKey: minioConfig.accessKey,
      secretKey: minioConfig.secretKey,
    });

    this.minioClient = new Minio.Client(minioConfig);
  }

  async listBucketContents(userId: string) {
    try {
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        throw new InternalServerErrorException(
          `Bucket ${this.bucketName} não encontrado. Por favor, crie o bucket no console do MinIO.`,
        );
      }

      this.logger.debug("Listando conteúdo do bucket...");

      // Get files from MongoDB for the specific user
      const bucketFiles = await this.bucketFileRepository.findByUserId(userId);

      // Get additional metadata from MinIO for user's directory
      const objects: any[] = [];
      const userPrefix = `${userId}/`;
      const stream = this.minioClient.listObjects(
        this.bucketName,
        userPrefix,
        true,
      );

      return new Promise((resolve, reject) => {
        stream.on("data", (obj) => {
          const bucketFile = bucketFiles.find((bf) => bf.fileName === obj.name);
          if (bucketFile) {
            objects.push({
              id: bucketFile.id,
              name: obj.name,
              size: obj.size,
              lastModified: obj.lastModified,
              etag: obj.etag,
              originalName: bucketFile.originalName,
              mimeType: bucketFile.mimeType,
              url: bucketFile.url,
            });
          }
        });

        stream.on("end", () => {
          this.logger.debug(
            `Encontrados ${objects.length} objetos no bucket para o usuário ${userId}`,
          );
          resolve(objects);
        });

        stream.on("error", (err: any) => {
          this.logger.error("Erro ao listar conteúdo do bucket:", {
            error: err,
            message: err.message,
            code: err.code,
            statusCode: err.statusCode,
          });
          reject(
            new InternalServerErrorException(
              "Falha ao listar conteúdo do bucket",
            ),
          );
        });
      });
    } catch (error: any) {
      this.logger.error("Erro inesperado ao listar conteúdo do bucket:", {
        error: error,
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
      });
      throw new InternalServerErrorException(
        error.message ||
        "Ocorreu um erro inesperado ao listar o conteúdo do bucket",
      );
    }
  }

  async uploadFile(file: Multer['File'], userId: string, knowledgeBaseId: string): Promise<FileUploadResultDto> {
    if (!knowledgeBaseId) {
      throw new BadRequestException('knowledgeBaseId é obrigatório para upload de arquivos');
    }

    this.logger.debug(`[UploadFile] Iniciando upload para usuário: ${userId} na base de conhecimento: ${knowledgeBaseId}`);

    // Cria o nome do objeto incluindo o diretório do usuário e knowledgeBaseId
    const objectName = `${userId}/${knowledgeBaseId}/${Date.now()}-${file.originalname}`;

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
      knowledgeBaseId: new Types.ObjectId(knowledgeBaseId),
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

  async listFiles(userId: string) {
    this.logger.debug(`[ListFiles] Listando arquivos do usuário: ${userId}`);
    return this.bucketFileRepository.findByUserId(userId);
  }

  async listFilesByDataset(userId: string, datasetId: string) {
    this.logger.debug(`[ListFilesByDataset] Listando arquivos do usuário: ${userId} para o dataset: ${datasetId}`);
    return this.bucketFileRepository.findByKnowledgeBaseId(datasetId);
  }

  async deleteFile(fileId: string, userId: string): Promise<void> {
    return this.deleteFileUseCase.execute(fileId, userId);
  }
}
