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
    UpdateChatbotDto,
    UpdateN8nConfigDto,
    UpdateVectorConfigDto,
    UpdateStatusDto,
    ChatbotResponseDto,
    ListChatbotsResponseDto,
} from '../../domain/dtos/chatbot.dtos';

@ApiTags('chatbots')
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
    @ApiOperation({ summary: 'Create a new chatbot' })
    @ApiResponse({ status: 201, type: ChatbotResponseDto })
    async create(
        @Request() req,
        @Body() dto: CreateChatbotDto,
    ): Promise<ChatbotResponseDto> {
        return this.createChatbotUseCase.execute(req.user.id, dto);
    }

    @Get()
    @ApiOperation({ summary: 'List all chatbots' })
    @ApiResponse({ status: 200, type: ListChatbotsResponseDto })
    async list(
        @Request() req,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ): Promise<ListChatbotsResponseDto> {
        return this.listChatbotsUseCase.execute(req.user.id, page, limit);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a chatbot' })
    @ApiResponse({ status: 200, type: ChatbotResponseDto })
    async update(
        @Request() req,
        @Param('id') id: string,
        @Body() dto: UpdateChatbotDto,
    ): Promise<ChatbotResponseDto> {
        return this.updateChatbotUseCase.execute(req.user.id, id, dto);
    }

    @Put(':id/n8n-config')
    @ApiOperation({ summary: 'Update chatbot N8N configuration' })
    @ApiResponse({ status: 200, type: ChatbotResponseDto })
    async updateN8nConfig(
        @Request() req,
        @Param('id') id: string,
        @Body() dto: UpdateN8nConfigDto,
    ): Promise<ChatbotResponseDto> {
        return this.updateN8nConfigUseCase.execute(req.user.id, id, dto);
    }

    @Put(':id/vector-config')
    @ApiOperation({ summary: 'Update chatbot Vector configuration' })
    @ApiResponse({ status: 200, type: ChatbotResponseDto })
    async updateVectorConfig(
        @Request() req,
        @Param('id') id: string,
        @Body() dto: UpdateVectorConfigDto,
    ): Promise<ChatbotResponseDto> {
        return this.updateVectorConfigUseCase.execute(req.user.id, id, dto);
    }

    @Put(':id/status')
    @ApiOperation({ summary: 'Update chatbot status' })
    @ApiResponse({ status: 200, type: ChatbotResponseDto })
    async updateStatus(
        @Request() req,
        @Param('id') id: string,
        @Body() dto: UpdateStatusDto,
    ): Promise<ChatbotResponseDto> {
        return this.updateStatusUseCase.execute(req.user.id, id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a chatbot' })
    @ApiResponse({ status: 204 })
    async delete(
        @Request() req,
        @Param('id') id: string,
    ): Promise<void> {
        await this.deleteChatbotUseCase.execute(req.user.id, id);
    }
} 