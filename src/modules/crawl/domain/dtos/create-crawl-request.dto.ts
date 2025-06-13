import { IsString, IsArray, IsOptional, IsUrl, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCrawlRequestDto {
    @ApiProperty({
        description: 'URL para fazer crawling',
        example: 'https://open.spotify.com/intl-pt/artist/6nynI5RNNt5DJ9gB4jCRTb'
    })
    @IsUrl()
    url: string;

    @ApiProperty({
        description: 'Formatos de saída desejados',
        example: ['json', 'markdown'],
        type: [String]
    })
    @IsArray()
    @IsString({ each: true })
    formats: string[];

    @ApiProperty({
        description: 'Opções para extração JSON',
        required: false
    })
    @IsOptional()
    @IsObject()
    jsonOptions?: any;
} 