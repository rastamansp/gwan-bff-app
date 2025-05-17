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
    Body
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
@Controller('dataset')
export class DatasetController {
    constructor(
        private readonly uploadFileUseCase: UploadFileUseCase,
        private readonly listFilesUseCase: ListFilesUseCase,
        private readonly datasetService: DatasetService,
    ) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Upload de arquivo' })
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
    async uploadFile(
        @UploadedFile() file: Multer['File'],
        @Body() uploadFileDto: UploadFileDto,
        @Req() req: AuthenticatedRequest
    ): Promise<FileUploadResultDto> {
        if (!uploadFileDto.knowledgeBaseId) {
            throw new BadRequestException('ID da base de conhecimento é obrigatório');
        }
        return this.datasetService.uploadFile(file, req.user.id, uploadFileDto.knowledgeBaseId);
    }

    @Get('files')
    @ApiOperation({ summary: 'Listar arquivos' })
    @ApiResponse({
        status: 200,
        description: 'Lista de arquivos',
        type: [FileListResultDto]
    })
    async listFiles(@Req() req: AuthenticatedRequest): Promise<FileListResultDto[]> {
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

    @Delete('files/:id')
    @ApiOperation({
        summary: 'Excluir arquivo',
        description: 'Remove um arquivo do dataset, excluindo tanto o arquivo do storage quanto o registro do banco de dados',
    })
    @ApiParam({ name: 'id', description: 'ID do arquivo a ser removido' })
    @ApiResponse({
        status: 200,
        description: 'Arquivo excluído com sucesso',
    })
    @ApiResponse({
        status: 404,
        description: 'Arquivo não encontrado',
    })
    @ApiResponse({
        status: 401,
        description: 'Não autorizado',
    })
    async deleteFile(
        @Param('id') id: string,
        @Req() req: AuthenticatedRequest
    ): Promise<void> {
        return this.datasetService.deleteFile(id, req.user.id);
    }
} 