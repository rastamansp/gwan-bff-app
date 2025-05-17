import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsBoolean, IsDate, MinLength, MaxLength, Matches } from 'class-validator';

@ApiSchema({ name: 'UserProfileResponseModel' })
export class UserProfileResponseDto {
    @ApiProperty({ description: 'ID do usuário' })
    id: string;

    @ApiProperty({ description: 'Nome do usuário' })
    name: string;

    @ApiProperty({ description: 'Email do usuário' })
    email: string;

    @ApiProperty({ description: 'Número do WhatsApp do usuário', required: false, nullable: true })
    whatsapp?: string;

    @ApiProperty({ description: 'Status de verificação do email' })
    isEmailVerified: boolean;

    @ApiProperty({ description: 'Status de ativação da conta' })
    isActive: boolean;

    @ApiProperty({ description: 'Status de verificação' })
    isVerified: boolean;

    @ApiProperty({ description: 'Data de criação do usuário' })
    createdAt: Date;

    @ApiProperty({ description: 'Data da última atualização do usuário' })
    updatedAt: Date;
}

@ApiSchema({ name: 'UserUpdateProfileModel' })
export class UserUpdateProfileDto {
    @ApiProperty({
        description: 'Nome do usuário',
        example: 'João da Silva',
        minLength: 3,
        maxLength: 100
    })
    @IsString()
    @MinLength(3, { message: 'O nome deve ter no mínimo 3 caracteres' })
    @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
    name: string;

    @ApiProperty({
        description: 'Número do WhatsApp do usuário',
        example: '+5511999999999',
        required: false,
        pattern: '\\+?[1-9]\\d{1,14}$'
    })
    @IsString()
    @IsOptional()
    @Matches(/\+?[1-9]\d{1,14}$/, {
        message: 'Formato de WhatsApp inválido. Use o formato internacional (ex: +5511999999999)'
    })
    whatsapp?: string;
}

@ApiSchema({ name: 'UserRegisterModel' })
export class UserRegisterDto {
    @ApiProperty({
        description: 'Nome do usuário',
        example: 'João da Silva',
        minLength: 3,
        maxLength: 100
    })
    @IsString()
    @MinLength(3, { message: 'O nome deve ter no mínimo 3 caracteres' })
    @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
    name: string;

    @ApiProperty({
        description: 'Email do usuário',
        example: 'joao@example.com'
    })
    @IsEmail({}, { message: 'Email inválido' })
    email: string;

    @ApiProperty({
        description: 'Número do WhatsApp do usuário',
        example: '+5511999999999',
        pattern: '\\+?[1-9]\\d{1,14}$'
    })
    @IsString()
    @Matches(/\+?[1-9]\d{1,14}$/, {
        message: 'Formato de WhatsApp inválido. Use o formato internacional (ex: +5511999999999)'
    })
    whatsapp: string;
}

@ApiSchema({ name: 'UserLoginModel' })
export class UserLoginDto {
    @ApiProperty({
        description: 'Email do usuário',
        example: 'joao@example.com'
    })
    @IsEmail({}, { message: 'Email inválido' })
    email: string;
}

@ApiSchema({ name: 'UserVerifyCodeModel' })
export class UserVerifyCodeDto {
    @ApiProperty({
        description: 'Código de verificação',
        example: '123456'
    })
    @IsString()
    code: string;

    @ApiProperty({
        description: 'Email do usuário',
        example: 'joao@example.com'
    })
    @IsEmail({}, { message: 'Email inválido' })
    email: string;
}

@ApiSchema({ name: 'UserAuthResponseModel' })
export class UserAuthResponseDto {
    @ApiProperty({ description: 'Token JWT de acesso' })
    accessToken: string;

    @ApiProperty({ description: 'Dados do usuário autenticado', type: () => UserProfileResponseDto })
    user: UserProfileResponseDto;
} 