import { IsBoolean, IsNotEmpty } from "class-validator";
import { ApiProperty, ApiSchema } from "@nestjs/swagger";

@ApiSchema({ name: 'UpdateChunkStatusModel' })
export class UpdateChunkStatusDto {
    @ApiProperty({
        description: 'Status de habilitação do chunk',
        example: true
    })
    @IsBoolean()
    @IsNotEmpty()
    enable: boolean;
} 