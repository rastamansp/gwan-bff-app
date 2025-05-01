import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class CreateKnowledgeBaseDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    fileId: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsNotEmpty()
    @IsEnum(['processing', 'completed', 'failed'])
    status: 'processing' | 'completed' | 'failed';
} 