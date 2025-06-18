import { Controller, Post, Body, Logger } from '@nestjs/common';
import { ProcessInstagramProfileUseCase } from '../../domain/use-cases/process-instagram-profile.use-case';
import { InstagramProfileDto } from '../../domain/dtos/instagram-profile.dto';

@Controller('instagram')
export class InstagramController {
    private readonly logger = new Logger(InstagramController.name);

    constructor(
        private readonly processInstagramProfileUseCase: ProcessInstagramProfileUseCase,
    ) { }

    @Post('profile')
    async processProfile(@Body() dto: InstagramProfileDto): Promise<{ message: string }> {
        this.logger.log(`Recebido JSON com username: ${JSON.stringify(dto)}`);
        return this.processInstagramProfileUseCase.execute(dto);
    }
} 