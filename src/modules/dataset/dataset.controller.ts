import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Req,
  UseGuards,
  Param,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { DatasetService } from "./dataset.service";
import { Express } from "express";
import { memoryStorage } from "multer";
import { Request } from "express";
import { JwtAuthGuard } from "../auth/infrastructure/guards/jwt-auth.guard";
import { Multer } from "multer";

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    [key: string]: any;
  };
}

@Controller("user/dataset")
@UseGuards(JwtAuthGuard)
export class DatasetController {
  constructor(private readonly datasetService: DatasetService) { }

  @Get("list")
  async listFiles(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }
    return this.datasetService.listBucketContents(userId);
  }

  @Post("upload")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),
      fileFilter: (req, file, callback) => {
        if (file.mimetype !== "application/pdf") {
          return callback(
            new Error("Apenas arquivos PDF são permitidos!"),
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
    @UploadedFile() file: Multer["File"],
    @Req() req: AuthenticatedRequest,
  ) {
    if (!file) {
      throw new Error("Nenhum arquivo foi enviado");
    }
    const userId = req.user.id;
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }
    return this.datasetService.handleFileUpload(file, userId);
  }

  @Post(":knowledgeBaseId/documents")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),
      fileFilter: (req, file, callback) => {
        if (file.mimetype !== "application/pdf") {
          return callback(
            new Error("Apenas arquivos PDF são permitidos!"),
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
    @UploadedFile() file: Multer["File"],
    @Param("knowledgeBaseId") knowledgeBaseId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!file) {
      throw new Error("Nenhum arquivo foi enviado");
    }
    const userId = req.user.id;
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }
    return this.datasetService.handleFileUpload(file, userId, knowledgeBaseId);
  }
}
