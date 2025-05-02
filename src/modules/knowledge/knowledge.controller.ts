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
} from "@nestjs/common";
import { KnowledgeService } from "./knowledge.service";
import { JwtAuthGuard } from "../auth/infrastructure/guards/jwt-auth.guard";
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiParam,
} from "@nestjs/swagger";
import { CreateKnowledgeBaseDto } from "./dto/create-knowledge-base.dto";
import { Request as ExpressRequest } from "express";

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
    constructor(private readonly knowledgeService: KnowledgeService) { }

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

    @Post(":id/start-process")
    async startProcess(
        @Param("id") id: string,
        @Req() req: AuthenticatedRequest,
    ) {
        const userId = req.user.id;
        return this.knowledgeService.startProcess(id, userId);
    }
}
