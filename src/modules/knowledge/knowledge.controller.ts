import { Controller, Get, Post, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { KnowledgeService } from './knowledge.service';
import { JwtAuthGuard } from '../auth/infrastructure/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('knowledge')
@Controller('user/knowledge')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class KnowledgeController {
    constructor(private readonly knowledgeService: KnowledgeService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new knowledge base from a file' })
    @ApiResponse({ status: 201, description: 'Knowledge base created successfully' })
    async createKnowledgeBase(
        @Request() req,
        @Body() body: { fileId: string; name: string; description: string },
    ) {
        console.log('Request body:', body);
        console.log('User from JWT:', req.user);
        return this.knowledgeService.createKnowledgeBase(
            req.user.id,
            body.fileId,
            body.name,
            body.description,
        );
    }

    @Get()
    @ApiOperation({ summary: 'List all knowledge bases for the current user' })
    @ApiResponse({ status: 200, description: 'Returns list of knowledge bases' })
    async listKnowledgeBases(@Request() req) {
        return this.knowledgeService.listUserKnowledgeBases(req.user.id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific knowledge base' })
    @ApiResponse({ status: 200, description: 'Returns the knowledge base' })
    async getKnowledgeBase(@Request() req, @Param('id') id: string) {
        return this.knowledgeService.getKnowledgeBaseById(id, req.user.id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a knowledge base' })
    @ApiResponse({ status: 200, description: 'Knowledge base deleted successfully' })
    async deleteKnowledgeBase(@Request() req, @Param('id') id: string) {
        return this.knowledgeService.deleteKnowledgeBase(id, req.user.id);
    }
} 