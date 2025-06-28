import { Controller, Post, Body, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ProcessInstagramProfileUseCase } from '../../domain/use-cases/process-instagram-profile.use-case';
import { InstagramProfileDto } from '../../domain/dtos/instagram-profile.dto';

@ApiTags('Instagram')
@Controller('instagram')
export class InstagramController {
    private readonly logger = new Logger(InstagramController.name);

    constructor(
        private readonly processInstagramProfileUseCase: ProcessInstagramProfileUseCase,
    ) { }

    @Post('profile')
    @ApiOperation({
        summary: 'Processar perfil do Instagram',
        description: 'Processa um perfil do Instagram com base no username fornecido'
    })
    @ApiBody({
        type: InstagramProfileDto,
        description: 'Dados do perfil do Instagram para processamento'
    })
    @ApiResponse({
        status: 200,
        description: 'Perfil processado com sucesso',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'Perfil do Instagram processado com sucesso'
                }
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: 'Dados inválidos fornecidos'
    })
    @ApiResponse({
        status: 500,
        description: 'Erro interno do servidor'
    })
    async processProfile(@Body() dto: InstagramProfileDto): Promise<{ message: string }> {
        this.logger.log(`Recebido JSON com username: ${JSON.stringify(dto)}`);
        return this.processInstagramProfileUseCase.execute(dto);
    }
} 