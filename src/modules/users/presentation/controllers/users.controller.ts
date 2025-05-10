import {
    Controller,
    Get,
    Put,
    Param,
    Body,
    UseGuards,
    Logger,
} from '@nestjs/common';
import { GetUserUseCase } from '../../application/use-cases/get-user.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case';
import { ListUsersUseCase } from '../../application/use-cases/list-users.use-case';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    private readonly logger = new Logger(UsersController.name);

    constructor(
        private readonly getUserUseCase: GetUserUseCase,
        private readonly updateUserUseCase: UpdateUserUseCase,
        private readonly listUsersUseCase: ListUsersUseCase,
    ) { }

    @Get()
    @ApiOperation({ summary: 'Listar todos os usuários' })
    @ApiResponse({ status: 200, description: 'Lista de usuários retornada com sucesso' })
    async list() {
        this.logger.log('[UsersController] Listando usuários');
        const users = await this.listUsersUseCase.execute();
        return users.map(user => user.toJSON());
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obter usuário por ID' })
    @ApiResponse({ status: 200, description: 'Usuário encontrado com sucesso' })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
    async getById(@Param('id') id: string) {
        this.logger.log(`[UsersController] Buscando usuário com ID: ${id}`);
        const user = await this.getUserUseCase.execute(id);
        return user.toJSON();
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualizar usuário' })
    @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
    async update(
        @Param('id') id: string,
        @Body() data: { name?: string },
    ) {
        this.logger.log(`[UsersController] Atualizando usuário com ID: ${id}`);
        const user = await this.updateUserUseCase.execute({
            id,
            name: data.name,
        });
        return user.toJSON();
    }
} 