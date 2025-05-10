import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadFileDto {
    @ApiProperty({ description: 'ID da base de conhecimento (opcional)' })
    @IsString()
    @IsOptional()
    knowledgeBaseId?: string;
} 