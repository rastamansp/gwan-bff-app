import { Controller, Put, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../modules/auth/infrastructure/guards/jwt-auth.guard';
import { UpdateProfileUseCase } from '../../application/use-cases/update-profile.use-case';
import { GetUserProfileUseCase } from '../../application/use-cases/get-user-profile.use-case';
import { UserUpdateProfileDto, UserProfileResponseDto } from '../../../users/domain/dtos/user.dtos';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
    constructor(
        private readonly updateProfileUseCase: UpdateProfileUseCase,
        private readonly getUserProfileUseCase: GetUserProfileUseCase,
    ) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Obter perfil do usuário',
        description: 'Retorna os dados do perfil do usuário autenticado'
    })
    @ApiResponse({
        status: 200,
        description: 'Perfil obtido com sucesso',
        type: UserProfileResponseDto
    })
    @ApiResponse({
        status: 401,
        description: 'Não autorizado - Token JWT inválido ou ausente'
    })
    @ApiResponse({
        status: 404,
        description: 'Usuário não encontrado'
    })
    async getProfile(@Request() req): Promise<UserProfileResponseDto> {
        return this.getUserProfileUseCase.execute(req.user.id);
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Atualizar perfil do usuário',
        description: 'Atualiza o nome e/ou WhatsApp do perfil do usuário autenticado'
    })
    @ApiBody({
        type: UserUpdateProfileDto,
        description: 'Dados para atualização do perfil',
        examples: {
            example1: {
                value: {
                    name: 'João da Silva',
                    whatsapp: '+5511999999999'
                },
                summary: 'Atualização completa'
            },
            example2: {
                value: {
                    name: 'João da Silva'
                },
                summary: 'Atualização apenas do nome'
            },
            example3: {
                value: {
                    whatsapp: '+5511999999999'
                },
                summary: 'Atualização apenas do WhatsApp'
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Perfil atualizado com sucesso',
        type: UserProfileResponseDto
    })
    @ApiResponse({
        status: 400,
        description: 'Dados inválidos - Verifique os campos obrigatórios e suas restrições'
    })
    @ApiResponse({
        status: 401,
        description: 'Não autorizado - Token JWT inválido ou ausente'
    })
    @ApiResponse({
        status: 404,
        description: 'Usuário não encontrado'
    })
    async updateProfile(
        @Request() req,
        @Body() updateProfileDto: UserUpdateProfileDto,
    ): Promise<UserProfileResponseDto> {
        return this.updateProfileUseCase.execute(req.user.id, updateProfileDto);
    }
} 