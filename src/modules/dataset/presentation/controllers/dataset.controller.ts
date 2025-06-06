import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    Get,
    Req,
    UseGuards,
    Param,
    BadRequestException,
    Delete,
    Query,
    Body,
    Logger
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { memoryStorage } from 'multer';
import { Request } from 'express';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { Multer } from 'multer';
import { UploadFileUseCase } from '../../application/use-cases/upload-file.use-case';
import { ListFilesUseCase } from '../../application/use-cases/list-files.use-case';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { DatasetService } from '../../dataset.service';
import { FileListResultDto, FileUploadResultDto } from '../../application/dtos/file-result.dto';
import { UploadFileDto } from '../../application/dtos/upload-file.dto';

interface AuthenticatedRequest extends Request {
    user: {
        id: string;
    };
}

@ApiTags('Dataset')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user/datasets')
export class DatasetController {
    constructor(
        private readonly uploadFileUseCase: UploadFileUseCase,
        private readonly listFilesUseCase: ListFilesUseCase,
        private readonly datasetService: DatasetService,
    ) { }

    // Endpoint legado - será mantido por compatibilidade
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Upload de arquivo (legado)' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Arquivo para upload'
                },
                knowledgeBaseId: {
                    type: 'string',
                    description: 'ID da base de conhecimento'
                }
            }
        }
    })
    @ApiResponse({
        status: 201,
        description: 'Arquivo enviado com sucesso',
        type: FileUploadResultDto
    })
    async uploadFileLegacy(
        @UploadedFile() file: Multer['File'],
        @Body() uploadFileDto: UploadFileDto,
        @Req() req: AuthenticatedRequest
    ): Promise<FileUploadResultDto> {
        if (!uploadFileDto.knowledgeBaseId) {
            throw new BadRequestException('ID da base de conhecimento é obrigatório');
        }
        return this.datasetService.uploadFile(file, req.user.id, uploadFileDto.knowledgeBaseId);
    }

    // Novo endpoint seguindo DDD
    @Post(':datasetId/documents')
    @UseInterceptors(FileInterceptor('file', {
        storage: memoryStorage(),
        limits: {
            fileSize: 10 * 1024 * 1024, // 10MB
        },
        fileFilter: (req, file, callback) => {
            if (!file.mimetype.match(/^application\/pdf$/)) {
                return callback(new BadRequestException('Apenas arquivos PDF são permitidos'), false);
            }
            callback(null, true);
        }
    }))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Upload de documento para um dataset específico' })
    @ApiParam({ name: 'datasetId', description: 'ID do dataset' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Arquivo para upload'
                }
            }
        }
    })
    @ApiResponse({
        status: 201,
        description: 'Documento enviado com sucesso',
        type: FileUploadResultDto
    })
    async uploadDocument(
        @Param('datasetId') datasetId: string,
        @UploadedFile() file: Multer['File'],
        @Req() req: AuthenticatedRequest
    ): Promise<FileUploadResultDto> {
        const logger = new Logger(DatasetController.name);

        logger.debug('[DatasetController] Detalhes da requisição:', {
            method: req.method,
            url: req.url,
            headers: {
                'content-type': req.headers['content-type'],
                'content-length': req.headers['content-length'],
                'authorization': req.headers.authorization ? 'presente' : 'ausente'
            },
            body: req.body,
            file: file ? {
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                fieldname: file.fieldname,
                encoding: file.encoding,
                buffer: file.buffer ? 'presente' : 'ausente',
                destination: file.destination,
                filename: file.filename,
                path: file.path
            } : 'arquivo não fornecido'
        });

        if (!file) {
            logger.error('[DatasetController] Arquivo não fornecido na requisição');
            throw new BadRequestException('Arquivo não fornecido');
        }

        if (!file.buffer) {
            logger.error('[DatasetController] Buffer do arquivo não encontrado', {
                file: {
                    originalname: file.originalname,
                    mimetype: file.mimetype,
                    size: file.size,
                    fieldname: file.fieldname,
                    encoding: file.encoding
                }
            });
            throw new BadRequestException('Arquivo inválido ou corrompido');
        }

        return this.datasetService.uploadFile(file, req.user.id, datasetId);
    }

    // Endpoint legado - será mantido por compatibilidade
    @Get('files')
    @ApiOperation({ summary: 'Listar arquivos (legado)' })
    @ApiResponse({
        status: 200,
        description: 'Lista de arquivos',
        type: [FileListResultDto]
    })
    async listFilesLegacy(@Req() req: AuthenticatedRequest): Promise<FileListResultDto[]> {
        const files = await this.datasetService.listFiles(req.user.id);
        return files.map(file => ({
            id: file.id,
            name: file.fileName,
            size: file.size,
            lastModified: file.createdAt,
            etag: file.id,
            originalName: file.originalName,
            mimeType: file.mimeType,
            url: file.url,
            status: file.status,
            processingError: file.processingError
        }));
    }

    // Novo endpoint seguindo DDD
    @Get(':datasetId/documents')
    @ApiOperation({ summary: 'Listar documentos de um dataset específico' })
    @ApiParam({ name: 'datasetId', description: 'ID do dataset' })
    @ApiResponse({
        status: 200,
        description: 'Lista de documentos',
        type: [FileListResultDto]
    })
    async listDocuments(
        @Param('datasetId') datasetId: string,
        @Req() req: AuthenticatedRequest
    ): Promise<FileListResultDto[]> {
        const files = await this.datasetService.listFilesByDataset(req.user.id, datasetId);
        return files.map(file => ({
            id: file.id,
            name: file.fileName,
            size: file.size,
            lastModified: file.createdAt,
            etag: file.id,
            originalName: file.originalName,
            mimeType: file.mimeType,
            url: file.url,
            status: file.status,
            processingError: file.processingError
        }));
    }

    // Endpoint legado - será mantido por compatibilidade
    @Delete('files/:id')
    @ApiOperation({
        summary: 'Excluir arquivo (legado)',
        description: 'Remove um arquivo do dataset, excluindo tanto o arquivo do storage quanto o registro do banco de dados',
    })
    @ApiParam({ name: 'id', description: 'ID do arquivo a ser removido' })
    @ApiResponse({
        status: 200,
        description: 'Arquivo excluído com sucesso',
    })
    async deleteFileLegacy(
        @Param('id') id: string,
        @Req() req: AuthenticatedRequest
    ): Promise<void> {
        return this.datasetService.deleteFile(id, req.user.id);
    }

    // Novo endpoint seguindo DDD
    @Delete(':datasetId/documents/:documentId')
    @ApiOperation({
        summary: 'Excluir documento de um dataset específico',
        description: 'Remove um documento do dataset, excluindo tanto o arquivo do storage quanto o registro do banco de dados',
    })
    @ApiParam({ name: 'datasetId', description: 'ID do dataset' })
    @ApiParam({ name: 'documentId', description: 'ID do documento a ser removido' })
    @ApiResponse({
        status: 200,
        description: 'Documento excluído com sucesso',
    })
    async deleteDocument(
        @Param('datasetId') datasetId: string,
        @Param('documentId') documentId: string,
        @Req() req: AuthenticatedRequest
    ): Promise<void> {
        return this.datasetService.deleteFile(documentId, req.user.id);
    }
} 