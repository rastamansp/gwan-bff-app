import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class InstagramService {
    private readonly logger = new Logger(InstagramService.name);

    async processProfile(username: string): Promise<void> {
        this.logger.log(`Processando profile do Instagram: ${username}`);
    }
} 