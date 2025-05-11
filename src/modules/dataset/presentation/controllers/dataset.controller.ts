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
    Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { memoryStorage } from 'multer';
import { Request as ExpressRequest } from 'express';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { Multer } from 'multer';
import { UploadFileUseCase } from '../../application/use-cases/upload-file.use-case';
import { ListFilesUseCase } from '../../application/use-cases/list-files.use-case';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { DatasetService } from '../../dataset.service';

interface AuthenticatedRequest extends ExpressRequest {
    user: {
        id: string;
        [key: string]: any;
    };
}

@ApiTags('dataset')
@Controller('user/dataset')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DatasetController {
    constructor(
        private readonly uploadFileUseCase: UploadFileUseCase,
        private readonly listFilesUseCase: ListFilesUseCase,
        private readonly datasetService: DatasetService,
    ) { }

    @Get('list')
    @ApiOperation({ summary: 'Listar arquivos do usuário' })
    @ApiResponse({ status: 200, description: 'Lista de arquivos retornada com sucesso' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    async listFiles(@Req() req: AuthenticatedRequest) {
        const userId = req.user.id;
        if (!userId) {
            throw new BadRequestException('Usuário não autenticado');
        }
        return this.listFilesUseCase.execute(userId);
    }

    @Post(':knowledgeBaseId/documents')
    @ApiOperation({ summary: 'Fazer upload de arquivo para base de conhecimento' })
    @ApiParam({ name: 'knowledgeBaseId', description: 'ID da base de conhecimento' })
    @ApiResponse({ status: 201, description: 'Arquivo enviado com sucesso' })
    @ApiResponse({ status: 400, description: 'Arquivo inválido ou base de conhecimento não fornecida' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage(),
            fileFilter: (req, file, callback) => {
                if (file.mimetype !== 'application/pdf') {
                    return callback(
                        new BadRequestException('Apenas arquivos PDF são permitidos!'),
                        false,
                    );
                }
                callback(null, true);
            },
            limits: {
                fileSize: 20 * 1024 * 1024, // 20MB
            },
        }),
    )
    async uploadFile(
        @UploadedFile() file: Multer['File'],
        @Param('knowledgeBaseId') knowledgeBaseId: string,
        @Req() req: AuthenticatedRequest,
    ) {
        if (!file) {
            throw new BadRequestException('Nenhum arquivo foi enviado');
        }
        if (!knowledgeBaseId) {
            throw new BadRequestException('ID da base de conhecimento é obrigatório');
        }
        const userId = req.user.id;
        if (!userId) {
            throw new BadRequestException('Usuário não autenticado');
        }
        return this.uploadFileUseCase.execute(file, userId, knowledgeBaseId);
    }

    @Delete(':fileId')
    @ApiOperation({
        summary: 'Remover arquivo',
        description: 'Remove um arquivo do dataset, excluindo tanto o arquivo do storage quanto o registro do banco de dados',
    })
    @ApiParam({ name: 'fileId', description: 'ID do arquivo a ser removido' })
    @ApiResponse({
        status: 200,
        description: 'Arquivo removido com sucesso',
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
        @Request() req,
        @Param('fileId') fileId: string,
    ): Promise<void> {
        return this.datasetService.deleteFile(fileId, req.user.id);
    }
} 