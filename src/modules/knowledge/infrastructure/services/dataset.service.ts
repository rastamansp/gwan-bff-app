import { Injectable, Logger, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as Minio from "minio";
import { BucketFile } from "../../../dataset/domain/entities/bucket-file.entity";
import { IBucketFileRepository } from "../../../dataset/domain/repositories/bucket-file.repository";
import { Multer } from "multer";

@Injectable()
export class DatasetService {
  private readonly logger = new Logger(DatasetService.name);
  private readonly bucketName: string;
  private readonly minioClient: Minio.Client;

  constructor(
    private readonly configService: ConfigService,
    @Inject("IBucketFileRepository")
    private readonly bucketFileRepository: IBucketFileRepository,
  ) {
    this.bucketName =
      this.configService.get<string>("MINIO_BUCKET_NAME") || "datasets";

    this.minioClient = new Minio.Client({
      endPoint: this.configService.get<string>("MINIO_ENDPOINT") || "localhost",
      port: parseInt(this.configService.get<string>("MINIO_PORT") || "9000"),
      useSSL: this.configService.get<string>("MINIO_USE_SSL") === "true",
      accessKey:
        this.configService.get<string>("MINIO_ACCESS_KEY") || "minioadmin",
      secretKey:
        this.configService.get<string>("MINIO_SECRET_KEY") || "minioadmin",
    });
  }

  async handleFileUpload(
    file: Multer["File"],
    userId: string,
  ): Promise<BucketFile> {
    try {
      const objectName = `${userId}/${Date.now()}-${file.originalname}`;

      // Upload para o MinIO
      await this.minioClient.putObject(
        this.bucketName,
        objectName,
        file.buffer,
        file.size,
        { "Content-Type": file.mimetype },
      );

      // Gerar URL temporária
      const url = await this.minioClient.presignedGetObject(
        this.bucketName,
        objectName,
        24 * 60 * 60, // 24 horas
      );

      // Salvar metadados no MongoDB
      const bucketFile = await this.bucketFileRepository.create({
        userId,
        originalName: file.originalname,
        fileName: objectName,
        size: file.size,
        mimeType: file.mimetype,
        url,
        bucketName: this.bucketName,
      });

      return bucketFile;
    } catch (error) {
      this.logger.error(
        `Erro ao fazer upload do arquivo: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async listBucketContents(userId: string): Promise<BucketFile[]> {
    try {
      // Buscar arquivos do usuário no MongoDB
      const files = await this.bucketFileRepository.findByUserId(userId);

      // Atualizar URLs temporárias
      for (const file of files) {
        try {
          const url = await this.minioClient.presignedGetObject(
            this.bucketName,
            file.fileName,
            24 * 60 * 60, // 24 horas
          );
          file.url = url;
        } catch (error) {
          this.logger.warn(
            `Erro ao gerar URL para arquivo ${file.fileName}: ${error.message}`,
          );
        }
      }

      return files;
    } catch (error) {
      this.logger.error(
        `Erro ao listar arquivos: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async deleteFile(fileId: string, userId: string): Promise<void> {
    try {
      const file = await this.bucketFileRepository.findById(fileId);
      if (!file || file.userId !== userId) {
        throw new Error("Arquivo não encontrado");
      }

      // Deletar do MinIO
      await this.minioClient.removeObject(this.bucketName, file.fileName);

      // Deletar do MongoDB
      await this.bucketFileRepository.delete(fileId);
    } catch (error) {
      this.logger.error(
        `Erro ao deletar arquivo: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getFileUrl(fileId: string, userId: string): Promise<string> {
    try {
      const file = await this.bucketFileRepository.findById(fileId);
      if (!file || file.userId !== userId) {
        throw new Error("Arquivo não encontrado");
      }

      return await this.minioClient.presignedGetObject(
        this.bucketName,
        file.fileName,
        24 * 60 * 60, // 24 horas
      );
    } catch (error) {
      this.logger.error(
        `Erro ao gerar URL do arquivo: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
