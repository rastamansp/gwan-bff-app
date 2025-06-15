import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean } from "class-validator";
import { ApiProperty, ApiSchema } from "@nestjs/swagger";

@ApiSchema({ name: 'FindSimilarChunksModel' })
export class FindSimilarChunksDto {
    @ApiProperty({
        description: 'Texto para busca de similaridade',
        example: 'Como funciona o marketing digital?'
    })
    @IsString()
    @IsNotEmpty()
    text: string;

    @ApiProperty({
        description: 'Número máximo de resultados',
        default: 5,
        required: false
    })
    @IsNumber()
    @IsOptional()
    limit?: number;

    @ApiProperty({
        description: 'Filtrar apenas chunks ativos',
        default: true,
        required: false
    })
    @IsBoolean()
    @IsOptional()
    onlyEnabled?: boolean;
} 