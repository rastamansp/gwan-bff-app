import { IsString, IsNotEmpty, IsOptional, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateKnowledgeBaseDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: "Nome da base de conhecimento",
    example: "Base de Conhecimento de Marketing",
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

  @IsString()
  @IsNotEmpty()
  @IsEnum(["new", "processing", "completed", "failed"])
  status: "new" | "processing" | "completed" | "failed";
}
