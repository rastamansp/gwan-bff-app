import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
    @ApiProperty({
        description: 'Nome do usuário',
        example: 'John Doe',
        minLength: 3,
        maxLength: 100,
        required: false
    })
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    @IsOptional()
    name?: string;

    @ApiProperty({
        description: 'Descrição do usuário',
        example: 'Desenvolvedor Full Stack com experiência em Node.js e React',
        maxLength: 500,
        required: false
    })
    @IsString()
    @MaxLength(500)
    @IsOptional()
    description?: string;
} 