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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { memoryStorage } from 'multer';
import { Request } from 'express';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { Multer } from 'multer';
import { UploadFileUseCase } from '../../application/use-cases/upload-file.use-case';
import { ListFilesUseCase } from '../../application/use-cases/list-files.use-case';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

interface AuthenticatedRequest extends Request {
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

    @Post('upload')
    @ApiOperation({ summary: 'Fazer upload de arquivo' })
    @ApiResponse({ status: 201, description: 'Arquivo enviado com sucesso' })
    @ApiResponse({ status: 400, description: 'Arquivo inválido' })
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
                fileSize: 5 * 1024 * 1024, // 5MB
            },
        }),
    )
    async uploadFile(
        @UploadedFile() file: Multer['File'],
        @Req() req: AuthenticatedRequest,
    ) {
        if (!file) {
            throw new BadRequestException('Nenhum arquivo foi enviado');
        }
        const userId = req.user.id;
        if (!userId) {
            throw new BadRequestException('Usuário não autenticado');
        }
        return this.uploadFileUseCase.execute(file, userId);
    }

    @Post(':knowledgeBaseId/documents')
    @ApiOperation({ summary: 'Fazer upload de arquivo para base de conhecimento' })
    @ApiResponse({ status: 201, description: 'Arquivo enviado com sucesso' })
    @ApiResponse({ status: 400, description: 'Arquivo inválido' })
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
    async uploadFileToKnowledgeBase(
        @UploadedFile() file: Multer['File'],
        @Param('knowledgeBaseId') knowledgeBaseId: string,
        @Req() req: AuthenticatedRequest,
    ) {
        if (!file) {
            throw new BadRequestException('Nenhum arquivo foi enviado');
        }
        const userId = req.user.id;
        if (!userId) {
            throw new BadRequestException('Usuário não autenticado');
        }
        return this.uploadFileUseCase.execute(file, userId, knowledgeBaseId);
    }
} 