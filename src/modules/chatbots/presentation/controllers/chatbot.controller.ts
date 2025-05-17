import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CreateChatbotUseCase } from '../../application/use-cases/create-chatbot.use-case';
import { ListChatbotsUseCase } from '../../application/use-cases/list-chatbots.use-case';
import { UpdateChatbotUseCase } from '../../application/use-cases/update-chatbot.use-case';
import { DeleteChatbotUseCase } from '../../application/use-cases/delete-chatbot.use-case';
import { UpdateN8nConfigUseCase } from '../../application/use-cases/update-n8n-config.use-case';
import { UpdateVectorConfigUseCase } from '../../application/use-cases/update-vector-config.use-case';
import { UpdateStatusUseCase } from '../../application/use-cases/update-status.use-case';
import {
    CreateChatbotDto,
    UpdateChatbotRequestDto,
    UpdateN8nConfigDto,
    UpdateVectorConfigDto,
    UpdateChatbotStatusDto,
    ChatbotResponseDto,
    ListChatbotsResponseDto,
} from '../../domain/dtos/chatbot.dtos';

@ApiTags('Chatbots')
@Controller('chatbots')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatbotController {
    constructor(
        private readonly createChatbotUseCase: CreateChatbotUseCase,
        private readonly listChatbotsUseCase: ListChatbotsUseCase,
        private readonly updateChatbotUseCase: UpdateChatbotUseCase,
        private readonly deleteChatbotUseCase: DeleteChatbotUseCase,
        private readonly updateN8nConfigUseCase: UpdateN8nConfigUseCase,
        private readonly updateVectorConfigUseCase: UpdateVectorConfigUseCase,
        private readonly updateStatusUseCase: UpdateStatusUseCase,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Criar chatbot' })
    @ApiResponse({
        status: 201,
        description: 'Chatbot criado com sucesso',
        type: ChatbotResponseDto
    })
    async create(@Request() req, @Body() createChatbotDto: CreateChatbotDto) {
        return this.createChatbotUseCase.execute(req.user.id, createChatbotDto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar chatbots' })
    @ApiResponse({
        status: 200,
        description: 'Lista de chatbots retornada com sucesso',
        type: ListChatbotsResponseDto
    })
    async list(@Request() req) {
        return this.listChatbotsUseCase.execute(req.user.id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualizar chatbot' })
    @ApiResponse({
        status: 200,
        description: 'Chatbot atualizado com sucesso',
        type: ChatbotResponseDto
    })
    async update(
        @Request() req,
        @Param('id') id: string,
        @Body() updateChatbotDto: UpdateChatbotRequestDto
    ) {
        return this.updateChatbotUseCase.execute(req.user.id, id, updateChatbotDto);
    }

    @Put(':id/n8n-config')
    @ApiOperation({ summary: 'Atualizar configuração n8n do chatbot' })
    @ApiResponse({
        status: 200,
        description: 'Configuração n8n atualizada com sucesso',
        type: ChatbotResponseDto
    })
    async updateN8nConfig(
        @Request() req,
        @Param('id') id: string,
        @Body() updateN8nConfigDto: UpdateN8nConfigDto
    ) {
        return this.updateN8nConfigUseCase.execute(req.user.id, id, updateN8nConfigDto);
    }

    @Put(':id/vector-config')
    @ApiOperation({ summary: 'Atualizar configuração de vetores do chatbot' })
    @ApiResponse({
        status: 200,
        description: 'Configuração de vetores atualizada com sucesso',
        type: ChatbotResponseDto
    })
    async updateVectorConfig(
        @Request() req,
        @Param('id') id: string,
        @Body() updateVectorConfigDto: UpdateVectorConfigDto
    ) {
        return this.updateVectorConfigUseCase.execute(req.user.id, id, updateVectorConfigDto);
    }

    @Put(':id/status')
    @ApiOperation({ summary: 'Atualizar status do chatbot' })
    @ApiResponse({
        status: 200,
        description: 'Status do chatbot atualizado com sucesso',
        type: ChatbotResponseDto
    })
    async updateStatus(
        @Request() req,
        @Param('id') id: string,
        @Body() updateStatusDto: UpdateChatbotStatusDto
    ) {
        return this.updateStatusUseCase.execute(req.user.id, id, updateStatusDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Excluir chatbot' })
    @ApiResponse({
        status: 200,
        description: 'Chatbot excluído com sucesso'
    })
    async delete(@Request() req, @Param('id') id: string) {
        return this.deleteChatbotUseCase.execute(req.user.id, id);
    }
} 