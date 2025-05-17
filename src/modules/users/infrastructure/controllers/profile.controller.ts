import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiExtraModels } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { ProfileService } from '../../domain/services/profile.service';
import { UserProfileResponseDto, UserUpdateProfileDto } from '../../domain/dtos/user.dtos';

@ApiTags('Perfil do Usuário')
@Controller('user/profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@ApiExtraModels(UserProfileResponseDto, UserUpdateProfileDto)
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    @Get()
    @ApiOperation({
        summary: 'Obter perfil do usuário',
        description: 'Retorna as informações do perfil do usuário autenticado.'
    })
    @ApiResponse({
        status: 200,
        description: 'Perfil do usuário retornado com sucesso',
        type: UserProfileResponseDto
    })
    @ApiResponse({
        status: 401,
        description: 'Não autorizado - Token JWT ausente ou inválido'
    })
    @ApiResponse({
        status: 404,
        description: 'Usuário não encontrado'
    })
    async getProfile(@Request() req) {
        return this.profileService.getProfile(req.user.id);
    }

    @Patch()
    @ApiOperation({
        summary: 'Atualizar perfil do usuário',
        description: 'Atualiza as informações do perfil do usuário autenticado.'
    })
    @ApiResponse({
        status: 200,
        description: 'Perfil atualizado com sucesso',
        type: UserProfileResponseDto
    })
    @ApiResponse({
        status: 400,
        description: 'Dados inválidos fornecidos'
    })
    @ApiResponse({
        status: 401,
        description: 'Não autorizado - Token JWT ausente ou inválido'
    })
    @ApiResponse({
        status: 404,
        description: 'Usuário não encontrado'
    })
    async updateProfile(
        @Request() req,
        @Body() updateProfileDto: UserUpdateProfileDto,
    ) {
        return this.profileService.updateProfile(req.user.id, updateProfileDto);
    }
} 