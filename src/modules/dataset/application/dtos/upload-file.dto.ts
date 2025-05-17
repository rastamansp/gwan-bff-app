import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: 'DatasetUploadFileModel' })
export class UploadFileDto {
    @ApiProperty({ description: 'ID da base de conhecimento (opcional)' })
    @IsString()
    @IsOptional()
    knowledgeBaseId?: string;
} 