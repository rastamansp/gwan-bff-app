import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiExtraModels } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { ProfileService } from '../../domain/services/profile.service';
import { UpdateProfileDto } from '../../domain/dto/update-profile.dto';
import { ProfileResponseDto } from '../../domain/dto/profile-response.dto';

@ApiTags('Perfil do Usuário')
@Controller('user/profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@ApiExtraModels(ProfileResponseDto, UpdateProfileDto)
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
        type: ProfileResponseDto
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
        type: ProfileResponseDto
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
        @Body() updateProfileDto: UpdateProfileDto,
    ) {
        return this.profileService.updateProfile(req.user.id, updateProfileDto);
    }
} 