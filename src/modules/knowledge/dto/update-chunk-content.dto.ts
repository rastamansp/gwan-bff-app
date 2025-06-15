import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty, ApiSchema } from "@nestjs/swagger";

@ApiSchema({ name: 'UpdateChunkContentModel' })
export class UpdateChunkContentDto {
    @ApiProperty({
        description: 'Novo conteúdo do chunk',
        example: 'Este é o novo conteúdo do chunk...'
    })
    @IsString()
    @IsNotEmpty()
    content: string;
} 