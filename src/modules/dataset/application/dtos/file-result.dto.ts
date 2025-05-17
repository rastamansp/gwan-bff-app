import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { FileStatus } from '../../domain/enums/file-status.enum';

@ApiSchema({ name: 'DatasetFileListResultModel' })
export class FileListResultDto {
    @ApiProperty({ description: 'ID do arquivo' })
    id: string;

    @ApiProperty({ description: 'Nome do arquivo' })
    name: string;

    @ApiProperty({ description: 'Tamanho do arquivo em bytes' })
    size: number;

    @ApiProperty({ description: 'Data da última modificação' })
    lastModified: Date;

    @ApiProperty({ description: 'ETag do arquivo' })
    etag: string;

    @ApiProperty({ description: 'Nome original do arquivo' })
    originalName: string;

    @ApiProperty({ description: 'Tipo MIME do arquivo' })
    mimeType: string;

    @ApiProperty({ description: 'URL do arquivo' })
    url: string;

    @ApiProperty({
        description: 'Status do arquivo',
        enum: FileStatus,
        enumName: 'FileStatus'
    })
    status: FileStatus;

    @ApiProperty({ description: 'Mensagem de erro no processamento', required: false })
    processingError?: string;
}

@ApiSchema({ name: 'DatasetFileUploadResultModel' })
export class FileUploadResultDto {
    @ApiProperty({ description: 'ID do arquivo' })
    id: string;

    @ApiProperty({ description: 'Nome original do arquivo' })
    originalname: string;

    @ApiProperty({ description: 'Nome do arquivo no storage' })
    filename: string;

    @ApiProperty({ description: 'Tamanho do arquivo em bytes' })
    size: number;

    @ApiProperty({ description: 'Tipo MIME do arquivo' })
    mimetype: string;

    @ApiProperty({ description: 'URL do arquivo' })
    url: string;

    @ApiProperty({ description: 'ID da base de conhecimento' })
    knowledgeBaseId: string;

    @ApiProperty({
        description: 'Status do arquivo',
        enum: FileStatus,
        enumName: 'FileStatus'
    })
    status: FileStatus;
} 