import {
    Controller,
    Get,
    Post,
    Put,
    Body,
    Param,
    UseGuards,
    Request,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CreateChatbotUseCase } from '../../application/use-cases/create-chatbot.use-case';
import { ChatbotService } from '../../domain/services/chatbot.service';
import {
    CreateChatbotDto,
    UpdateChatbotDto,
    UpdateN8nConfigDto,
    UpdateVectorConfigDto,
    UpdateStatusDto,
} from '../../application/dtos/chatbot.dtos';

@ApiTags('chatbots')
@Controller('chatbots')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatbotController {
    constructor(
        private readonly createChatbotUseCase: CreateChatbotUseCase,
        private readonly chatbotService: ChatbotService,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Criar um novo chatbot' })
    @ApiResponse({ status: 201, description: 'Chatbot criado com sucesso' })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 409, description: 'Já existe um chatbot com este nome' })
    async create(@Request() req, @Body() dto: CreateChatbotDto) {
        return this.createChatbotUseCase.execute(req.user.id, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todos os chatbots do usuário' })
    @ApiResponse({ status: 200, description: 'Lista de chatbots retornada com sucesso' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    async findAll(@Request() req) {
        return this.chatbotService.findByUserId(req.user.id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar um chatbot específico' })
    @ApiResponse({ status: 200, description: 'Chatbot encontrado com sucesso' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 404, description: 'Chatbot não encontrado' })
    async findOne(@Param('id') id: string) {
        return this.chatbotService.findById(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualizar um chatbot' })
    @ApiResponse({ status: 200, description: 'Chatbot atualizado com sucesso' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 404, description: 'Chatbot não encontrado' })
    async update(@Param('id') id: string, @Body() dto: UpdateChatbotDto) {
        return this.chatbotService.update(id, dto);
    }

    @Put(':id/n8n-config')
    @ApiOperation({ summary: 'Atualizar configuração n8n do chatbot' })
    @ApiResponse({ status: 200, description: 'Configuração atualizada com sucesso' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 404, description: 'Chatbot não encontrado' })
    async updateN8nConfig(@Param('id') id: string, @Body() dto: UpdateN8nConfigDto) {
        return this.chatbotService.updateN8nConfig(id, dto);
    }

    @Put(':id/vector-config')
    @ApiOperation({ summary: 'Atualizar configuração de vetor do chatbot' })
    @ApiResponse({ status: 200, description: 'Configuração atualizada com sucesso' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 404, description: 'Chatbot não encontrado' })
    async updateVectorConfig(@Param('id') id: string, @Body() dto: UpdateVectorConfigDto) {
        return this.chatbotService.updateVectorConfig(id, dto);
    }

    @Put(':id/status')
    @ApiOperation({ summary: 'Atualizar status do chatbot' })
    @ApiResponse({ status: 200, description: 'Status atualizado com sucesso' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 404, description: 'Chatbot não encontrado' })
    async updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
        return this.chatbotService.updateStatus(id, dto.isActive);
    }
} 