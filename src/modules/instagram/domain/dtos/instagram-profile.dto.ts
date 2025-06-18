import { IsString, IsNotEmpty } from 'class-validator';

export class InstagramProfileDto {
    @IsString()
    @IsNotEmpty()
    username: string;
} 