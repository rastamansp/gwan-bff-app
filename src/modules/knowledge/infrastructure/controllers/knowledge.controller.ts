import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../core/domain/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateKnowledgeDto } from '../../domain/dtos/create-knowledge.dto';
import { UpdateKnowledgeDto } from '../../domain/dtos/update-knowledge.dto';
import { KnowledgeResponseDto } from '../../domain/dtos/knowledge-response.dto';
import { CreateKnowledgeUseCase } from '../../application/use-cases/create-knowledge/create-knowledge.usecase';
import { UpdateKnowledgeUseCase } from '../../application/use-cases/update-knowledge/update-knowledge.usecase';
import { FindKnowledgeUseCase } from '../../application/use-cases/find-knowledge/find-knowledge.usecase';

@ApiTags('knowledge')
@Controller('knowledge')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class KnowledgeController {
    constructor(
        private readonly createKnowledgeUseCase: CreateKnowledgeUseCase,
        private readonly updateKnowledgeUseCase: UpdateKnowledgeUseCase,
        private readonly findKnowledgeUseCase: FindKnowledgeUseCase,
    ) { }

    @Get('category/:category')
    @ApiOperation({ summary: 'Find knowledge by category' })
    @ApiResponse({ status: 200, type: [KnowledgeResponseDto] })
    async findByCategory(@Param('category') category: string): Promise<KnowledgeResponseDto[]> {
        return this.findKnowledgeUseCase.findByCategory(category);
    }

    @Get('author')
    @ApiOperation({ summary: 'Find knowledge by author' })
    @ApiResponse({ status: 200, type: [KnowledgeResponseDto] })
    async findByAuthor(@Request() req): Promise<KnowledgeResponseDto[]> {
        return this.findKnowledgeUseCase.findByAuthorId(req.user.id);
    }

    @Get('tags')
    @ApiOperation({ summary: 'Find knowledge by tags' })
    @ApiResponse({ status: 200, type: [KnowledgeResponseDto] })
    async findByTags(@Query('tags') tags: string): Promise<KnowledgeResponseDto[]> {
        const tagArray = tags.split(',').map(tag => tag.trim());
        return this.findKnowledgeUseCase.findByTags(tagArray);
    }

    @Post()
    @ApiOperation({ summary: 'Create knowledge' })
    @ApiResponse({ status: 201, type: KnowledgeResponseDto })
    async create(@Body() data: CreateKnowledgeDto, @Request() req): Promise<KnowledgeResponseDto> {
        return this.createKnowledgeUseCase.execute(data, req.user.id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update knowledge' })
    @ApiResponse({ status: 200, type: KnowledgeResponseDto })
    async update(@Param('id') id: string, @Body() data: UpdateKnowledgeDto): Promise<KnowledgeResponseDto> {
        return this.updateKnowledgeUseCase.execute(id, data);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Find knowledge by id' })
    @ApiResponse({ status: 200, type: KnowledgeResponseDto })
    async findById(@Param('id') id: string): Promise<KnowledgeResponseDto> {
        return this.findKnowledgeUseCase.findById(id);
    }

    @Get()
    @ApiOperation({ summary: 'Find all knowledge' })
    @ApiResponse({ status: 200, type: [KnowledgeResponseDto] })
    async findAll(): Promise<KnowledgeResponseDto[]> {
        return this.findKnowledgeUseCase.findAll();
    }

    @Get('my')
    @ApiOperation({ summary: 'Get all knowledge from current user' })
    @ApiResponse({ status: 200, description: 'Return all knowledge from current user', type: [KnowledgeResponseDto] })
    async findMyKnowledge(@Req() req: any): Promise<KnowledgeResponseDto[]> {
        return this.findKnowledgeUseCase.findByAuthorId(req.user.id);
    }
} 