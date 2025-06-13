import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    Body,
    UseGuards,
    Request,
    Req,
    Patch,
} from "@nestjs/common";
import { KnowledgeService } from "./knowledge.service";
import { JwtAuthGuard } from "../auth/infrastructure/guards/jwt-auth.guard";
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiParam,
    ApiBody,
} from "@nestjs/swagger";
import { CreateKnowledgeBaseDto } from "./dto/create-knowledge-base.dto";
import { Request as ExpressRequest } from "express";
import { EmbeddingService } from './domain/services/embedding.service';
import { OpenAIEmbeddingService } from './domain/services/openai-embedding.service';
import { FindSimilarChunksDto } from './dto/find-similar-chunks.dto';
import { UpdateChunkStatusDto } from './dto/update-chunk-status.dto';
import { SimilarChunkResponseDto } from './dto/similar-chunk-response.dto';
import { UpdateChunkContentDto } from './dto/update-chunk-content.dto';

interface AuthenticatedRequest extends ExpressRequest {
    user: {
        id: string;
        [key: string]: any;
    };
}

@ApiTags("knowledge")
@Controller("user/knowledge")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class KnowledgeController {
    constructor(
        private readonly knowledgeService: KnowledgeService,
        private readonly embeddingService: EmbeddingService,
        private readonly openAIEmbeddingService: OpenAIEmbeddingService,
    ) { }

    @Post()
    @ApiOperation({
        summary: "Criar uma nova base de conhecimento",
        description:
            "Cria uma nova base de conhecimento a partir de um arquivo PDF existente",
    })
    @ApiResponse({
        status: 201,
        description: "Base de conhecimento criada com sucesso",
        schema: {
            properties: {
                _id: { type: "string", example: "507f1f77bcf86cd799439011" },
                userId: { type: "string", example: "507f1f77bcf86cd799439012" },
                name: { type: "string", example: "Base de Conhecimento de Marketing" },
                description: {
                    type: "string",
                    example:
                        "Base de conhecimento contendo informações sobre estratégias de marketing digital",
                },
                status: {
                    type: "string",
                    example: "processing",
                    enum: ["processing", "completed", "failed"],
                },
                createdAt: { type: "string", format: "date-time" },
                updatedAt: { type: "string", format: "date-time" },
            },
        },
    })
    @ApiResponse({ status: 400, description: "Dados inválidos fornecidos" })
    @ApiResponse({ status: 401, description: "Não autorizado" })
    async createKnowledgeBase(
        @Request() req,
        @Body() createKnowledgeBaseDto: CreateKnowledgeBaseDto,
    ) {
        return this.knowledgeService.createKnowledgeBase(
            req.user.id,
            createKnowledgeBaseDto.name,
            createKnowledgeBaseDto.description,
        );
    }

    @Get()
    @ApiOperation({
        summary: "Listar bases de conhecimento",
        description: "Retorna todas as bases de conhecimento do usuário atual",
    })
    @ApiResponse({
        status: 200,
        description: "Lista de bases de conhecimento retornada com sucesso",
        schema: {
            type: "array",
            items: {
                properties: {
                    _id: { type: "string", example: "507f1f77bcf86cd799439011" },
                    userId: { type: "string", example: "507f1f77bcf86cd799439012" },
                    fileId: { type: "string", example: "507f1f77bcf86cd799439013" },
                    name: {
                        type: "string",
                        example: "Base de Conhecimento de Marketing",
                    },
                    description: {
                        type: "string",
                        example:
                            "Base de conhecimento contendo informações sobre estratégias de marketing digital",
                    },
                    filename: { type: "string", example: "marketing_strategies.pdf" },
                    status: {
                        type: "string",
                        example: "processing",
                        enum: ["processing", "completed", "failed"],
                    },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                },
            },
        },
    })
    @ApiResponse({ status: 401, description: "Não autorizado" })
    async listKnowledgeBases(@Request() req) {
        return this.knowledgeService.listUserKnowledgeBases(req.user.id);
    }

    @Get(":id")
    @ApiOperation({
        summary: "Obter base de conhecimento específica",
        description: "Retorna uma base de conhecimento específica pelo ID",
    })
    @ApiParam({ name: "id", description: "ID da base de conhecimento" })
    @ApiResponse({
        status: 200,
        description: "Base de conhecimento retornada com sucesso",
        schema: {
            properties: {
                _id: { type: "string", example: "507f1f77bcf86cd799439011" },
                userId: { type: "string", example: "507f1f77bcf86cd799439012" },
                fileId: { type: "string", example: "507f1f77bcf86cd799439013" },
                name: { type: "string", example: "Base de Conhecimento de Marketing" },
                description: {
                    type: "string",
                    example:
                        "Base de conhecimento contendo informações sobre estratégias de marketing digital",
                },
                filename: { type: "string", example: "marketing_strategies.pdf" },
                status: {
                    type: "string",
                    example: "processing",
                    enum: ["processing", "completed", "failed"],
                },
                createdAt: { type: "string", format: "date-time" },
                updatedAt: { type: "string", format: "date-time" },
            },
        },
    })
    @ApiResponse({ status: 401, description: "Não autorizado" })
    @ApiResponse({
        status: 404,
        description: "Base de conhecimento não encontrada",
    })
    async getKnowledgeBase(@Request() req, @Param("id") id: string) {
        return this.knowledgeService.getKnowledgeBaseById(id, req.user.id);
    }

    @Delete(":id")
    @ApiOperation({
        summary: "Excluir base de conhecimento",
        description: "Exclui uma base de conhecimento específica pelo ID",
    })
    @ApiParam({ name: "id", description: "ID da base de conhecimento" })
    @ApiResponse({
        status: 200,
        description: "Base de conhecimento excluída com sucesso",
    })
    @ApiResponse({ status: 401, description: "Não autorizado" })
    @ApiResponse({
        status: 404,
        description: "Base de conhecimento não encontrada",
    })
    async deleteKnowledgeBase(@Request() req, @Param("id") id: string) {
        return this.knowledgeService.deleteKnowledgeBase(id, req.user.id);
    }

    @Post(":knowledgeBaseId/start-process/:bucketFileId")
    @ApiOperation({
        summary: "Iniciar processamento de arquivo",
        description: "Inicia o processamento de um arquivo específico na base de conhecimento",
    })
    @ApiParam({ name: "knowledgeBaseId", description: "ID da base de conhecimento" })
    @ApiParam({ name: "bucketFileId", description: "ID do arquivo a ser processado" })
    @ApiResponse({
        status: 200,
        description: "Processamento iniciado com sucesso",
        schema: {
            properties: {
                _id: { type: "string", example: "507f1f77bcf86cd799439011" },
                userId: { type: "string", example: "507f1f77bcf86cd799439012" },
                name: { type: "string", example: "Base de Conhecimento de Marketing" },
                description: { type: "string", example: "Base de conhecimento contendo informações sobre marketing" },
                status: { type: "string", example: "processing", enum: ["new", "processing", "completed", "failed"] },
                createdAt: { type: "string", format: "date-time" },
                updatedAt: { type: "string", format: "date-time" },
            },
        },
    })
    @ApiResponse({ status: 400, description: "Base de conhecimento já está em processamento" })
    @ApiResponse({ status: 401, description: "Não autorizado" })
    @ApiResponse({ status: 404, description: "Base de conhecimento não encontrada" })
    async startProcess(
        @Param("knowledgeBaseId") knowledgeBaseId: string,
        @Param("bucketFileId") bucketFileId: string,
        @Req() req: AuthenticatedRequest,
    ) {
        const userId = req.user.id;
        return this.knowledgeService.startProcess(knowledgeBaseId, userId, bucketFileId);
    }

    @Post(":knowledgeBaseId/similar")
    @ApiOperation({
        summary: "Buscar chunks similares",
        description: "Busca chunks de texto similares usando embeddings da OpenAI",
    })
    @ApiParam({ name: "knowledgeBaseId", description: "ID da base de conhecimento" })
    @ApiBody({ type: FindSimilarChunksDto })
    @ApiResponse({
        status: 200,
        description: "Chunks similares encontrados",
        type: [SimilarChunkResponseDto]
    })
    @ApiResponse({ status: 401, description: "Não autorizado" })
    @ApiResponse({ status: 404, description: "Base de conhecimento não encontrada" })
    async findSimilarChunksByText(
        @Param("knowledgeBaseId") knowledgeBaseId: string,
        @Body() body: FindSimilarChunksDto,
        @Req() req: AuthenticatedRequest,
    ): Promise<SimilarChunkResponseDto[]> {
        const userId = req.user.id;
        const { text, limit = 5, onlyEnabled = true } = body;

        // Verifica se a base existe e pertence ao usuário
        await this.knowledgeService.getKnowledgeBaseById(knowledgeBaseId, userId);

        // Gera o embedding do texto
        const embedding = await this.openAIEmbeddingService.generateEmbedding(text);

        // Busca os chunks similares
        const chunks = await this.embeddingService.findBySimilarity(
            knowledgeBaseId,
            userId,
            embedding,
            limit,
            onlyEnabled
        );

        return chunks.map(chunk => ({
            id: chunk.id,
            content: chunk.content,
            similarity: chunk.similarity,
            enable: chunk.enable,
            meta: chunk.meta,
            statusUrl: `/user/knowledge/${knowledgeBaseId}/chunks/${chunk.id}/status`
        }));
    }

    @Patch(":knowledgeBaseId/chunks/:chunkId/status")
    @ApiOperation({
        summary: "Atualizar status de um chunk",
        description: "Ativa ou desativa um chunk específico da base de conhecimento",
    })
    @ApiParam({ name: "knowledgeBaseId", description: "ID da base de conhecimento" })
    @ApiParam({ name: "chunkId", description: "ID do chunk a ser atualizado" })
    @ApiBody({ type: UpdateChunkStatusDto })
    @ApiResponse({
        status: 200,
        description: "Status do chunk atualizado com sucesso",
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                content: { type: 'string' },
                enable: { type: 'boolean' },
                meta: {
                    type: 'object',
                    properties: {
                        tokenCount: { type: 'number' },
                        pageNumber: { type: 'number' },
                        section: { type: 'string' },
                    },
                },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
            },
        },
    })
    @ApiResponse({ status: 401, description: "Não autorizado" })
    @ApiResponse({ status: 404, description: "Chunk não encontrado" })
    async updateChunkStatus(
        @Param("knowledgeBaseId") knowledgeBaseId: string,
        @Param("chunkId") chunkId: string,
        @Body() body: UpdateChunkStatusDto,
        @Req() req: AuthenticatedRequest,
    ) {
        const userId = req.user.id;

        // Verifica se a base existe e pertence ao usuário
        await this.knowledgeService.getKnowledgeBaseById(knowledgeBaseId, userId);

        // Atualiza o status do chunk
        const updatedChunk = await this.embeddingService.updateChunkStatus(
            chunkId,
            userId,
            body.enable
        );

        return {
            id: updatedChunk.id,
            content: updatedChunk.content,
            enable: updatedChunk.enable,
            meta: updatedChunk.meta,
            createdAt: updatedChunk.createdAt,
            updatedAt: updatedChunk.updatedAt,
        };
    }

    @Delete(":knowledgeBaseId/chunks/:chunkId")
    @ApiOperation({
        summary: "Deletar um chunk",
        description: "Remove um chunk específico da base de conhecimento",
    })
    @ApiParam({ name: "knowledgeBaseId", description: "ID da base de conhecimento" })
    @ApiParam({ name: "chunkId", description: "ID do chunk a ser deletado" })
    @ApiResponse({
        status: 200,
        description: "Chunk deletado com sucesso"
    })
    @ApiResponse({ status: 401, description: "Não autorizado" })
    @ApiResponse({ status: 404, description: "Chunk não encontrado" })
    async deleteChunk(
        @Param("knowledgeBaseId") knowledgeBaseId: string,
        @Param("chunkId") chunkId: string,
        @Req() req: AuthenticatedRequest,
    ) {
        const userId = req.user.id;

        // Verifica se a base existe e pertence ao usuário
        await this.knowledgeService.getKnowledgeBaseById(knowledgeBaseId, userId);

        // Deleta o chunk
        await this.embeddingService.deleteChunk(chunkId, userId);

        return { message: 'Chunk deletado com sucesso' };
    }

    @Patch(":knowledgeBaseId/chunks/:chunkId/content")
    @ApiOperation({
        summary: "Atualizar conteúdo de um chunk",
        description: "Atualiza o conteúdo de um chunk específico de uma base de conhecimento",
    })
    @ApiParam({ name: "knowledgeBaseId", description: "ID da base de conhecimento" })
    @ApiParam({ name: "chunkId", description: "ID do chunk a ser atualizado" })
    @ApiBody({ type: UpdateChunkContentDto })
    @ApiResponse({
        status: 200,
        description: "Conteúdo do chunk atualizado com sucesso",
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                content: { type: 'string' },
                enable: { type: 'boolean' },
                meta: {
                    type: 'object',
                    properties: {
                        tokenCount: { type: 'number' },
                        pageNumber: { type: 'number' },
                        section: { type: 'string' },
                    },
                },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
            },
        },
    })
    @ApiResponse({ status: 401, description: "Não autorizado" })
    @ApiResponse({ status: 404, description: "Base de conhecimento ou chunk não encontrado" })
    async updateChunkContent(
        @Param("knowledgeBaseId") knowledgeBaseId: string,
        @Param("chunkId") chunkId: string,
        @Body() body: UpdateChunkContentDto,
        @Req() req: AuthenticatedRequest,
    ) {
        const userId = req.user.id;

        // Verifica se a base existe e pertence ao usuário
        await this.knowledgeService.getKnowledgeBaseById(knowledgeBaseId, userId);

        // Atualiza o conteúdo do chunk, gerando novo embedding e atualizando metadados
        const updatedChunk = await this.embeddingService.updateChunkContent(
            chunkId,
            userId,
            body.content,
            this.openAIEmbeddingService
        );

        // Verifica se o chunk pertence à base de conhecimento
        if (updatedChunk.knowledgeBaseId !== knowledgeBaseId) {
            throw new Error('Chunk não pertence à base de conhecimento especificada');
        }

        return {
            id: updatedChunk.id,
            content: updatedChunk.content,
            enable: updatedChunk.enable,
            meta: updatedChunk.meta,
            createdAt: updatedChunk.createdAt,
            updatedAt: updatedChunk.updatedAt,
        };
    }
}
