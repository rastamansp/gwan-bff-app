import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: 'InstagramProfileModel' })
export class InstagramProfileDto {
    @ApiProperty({
        description: 'Nome de usuário do Instagram',
        example: 'cristiano',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    username: string;
} 