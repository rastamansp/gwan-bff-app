import { IsString, IsNotEmpty, IsOptional, IsEnum } from "class-validator";
import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { KnowledgeBaseStatus } from "../domain/enums/knowledge-base-status.enum";

@ApiSchema({ name: 'KnowledgeBaseCreateModel' })
export class CreateKnowledgeBaseDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: "Nome da base de conhecimento",
    example: "Base de Conhecimento de Marketing"
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "Descrição da base de conhecimento",
    example:
      "Base de conhecimento contendo informações sobre estratégias de marketing digital",
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: "Status da base de conhecimento",
    enum: KnowledgeBaseStatus,
    enumName: 'KnowledgeBaseStatus'
  })
  @IsEnum(KnowledgeBaseStatus)
  @IsNotEmpty()
  status: KnowledgeBaseStatus;
}
