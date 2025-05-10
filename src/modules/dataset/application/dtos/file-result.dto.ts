import { ApiProperty } from '@nestjs/swagger';
import { FileStatus } from '../../domain/entities/bucket-file.entity';

export interface FileListResult {
    id: string;
    name: string;
    size: number;
    lastModified: Date;
    etag: string;
    originalName: string;
    mimeType: string;
    url: string;
    status: FileStatus;
    processingError?: string;
}

export interface FileUploadResult {
    id: string;
    originalname: string;
    filename: string;
    size: number;
    mimetype: string;
    url: string;
    knowledgeBaseId?: string;
    status: FileStatus;
} 