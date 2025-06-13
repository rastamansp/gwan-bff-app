import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    UseGuards,
    Req,
    Logger,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CreateCrawlRequestDto } from '../../domain/dtos/create-crawl-request.dto';
import { CrawlResponseDto } from '../../domain/dtos/crawl-response.dto';
import { CreateCrawlRequestUseCase } from '../../application/use-cases/create-crawl-request/create-crawl-request.usecase';
import { GetCrawlRequestUseCase } from '../../application/use-cases/get-crawl-request/get-crawl-request.usecase';
import { ListCrawlRequestsUseCase } from '../../application/use-cases/list-crawl-requests/list-crawl-requests.usecase';

interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        [key: string]: any;
    };
}

@ApiTags('Crawling')
@Controller('user/crawling')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CrawlController {
    private readonly logger = new Logger(CrawlController.name);

    constructor(
        private readonly createCrawlRequestUseCase: CreateCrawlRequestUseCase,
        private readonly getCrawlRequestUseCase: GetCrawlRequestUseCase,
        private readonly listCrawlRequestsUseCase: ListCrawlRequestsUseCase,
    ) { }

    @Post()
    @ApiOperation({
        summary: 'Criar requisição de crawling',
        description: 'Cria uma nova requisição para fazer crawling de uma URL usando o Firecrawl',
    })
    @ApiResponse({
        status: 201,
        description: 'Requisição de crawling criada com sucesso',
        type: CrawlResponseDto,
    })
    @ApiResponse({ status: 400, description: 'Dados inválidos fornecidos' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    async createCrawlRequest(
        @Body() createCrawlRequestDto: CreateCrawlRequestDto,
        @Req() req: AuthenticatedRequest,
    ): Promise<CrawlResponseDto> {
        this.logger.log(`Nova requisição de crawling recebida para usuário ${req.user.id}`);

        return this.createCrawlRequestUseCase.execute(
            createCrawlRequestDto,
            req.user.id,
        );
    }

    @Get()
    @ApiOperation({
        summary: 'Listar requisições de crawling',
        description: 'Lista todas as requisições de crawling do usuário',
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de requisições de crawling',
        type: [CrawlResponseDto],
    })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    async listCrawlRequests(@Req() req: AuthenticatedRequest): Promise<CrawlResponseDto[]> {
        this.logger.log(`Listando requisições de crawling para usuário ${req.user.id}`);

        return this.listCrawlRequestsUseCase.execute(req.user.id);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Buscar requisição de crawling',
        description: 'Busca uma requisição de crawling específica por ID',
    })
    @ApiParam({ name: 'id', description: 'ID da requisição de crawling' })
    @ApiResponse({
        status: 200,
        description: 'Requisição de crawling encontrada',
        type: CrawlResponseDto,
    })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 404, description: 'Requisição de crawling não encontrada' })
    async getCrawlRequest(
        @Param('id') id: string,
        @Req() req: AuthenticatedRequest,
    ): Promise<CrawlResponseDto> {
        this.logger.log(`Buscando requisição de crawling ${id} para usuário ${req.user.id}`);

        return this.getCrawlRequestUseCase.execute(id, req.user.id);
    }
} 