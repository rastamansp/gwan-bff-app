import { IsBoolean, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateChunkStatusDto {
    @ApiProperty({
        description: 'Status de habilitação do chunk',
        example: true
    })
    @IsBoolean()
    @IsNotEmpty()
    enable: boolean;
} 