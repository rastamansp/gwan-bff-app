import { IsString, IsOptional, IsEnum } from "class-validator";
import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { KnowledgeBaseStatus } from "../domain/enums/knowledge-base-status.enum";

@ApiSchema({ name: 'KnowledgeBaseUpdateModel' })
export class UpdateKnowledgeBaseDto {
  @ApiProperty({
    description: "Nome da base de conhecimento",
    required: false
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: "Descrição da base de conhecimento",
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: "Status da base de conhecimento",
    enum: KnowledgeBaseStatus,
    enumName: 'KnowledgeBaseStatus',
    required: false
  })
  @IsEnum(KnowledgeBaseStatus)
  @IsOptional()
  status?: KnowledgeBaseStatus;

  @ApiProperty({ description: "Mensagem de erro, se houver", required: false })
  @IsString()
  @IsOptional()
  error?: string;
}
