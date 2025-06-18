import { Injectable } from '@nestjs/common';
import { InstagramService } from '../services/instagram.service';
import { InstagramProfileDto } from '../dtos/instagram-profile.dto';

@Injectable()
export class ProcessInstagramProfileUseCase {
    constructor(private readonly instagramService: InstagramService) { }

    async execute(dto: InstagramProfileDto): Promise<{ message: string }> {
        await this.instagramService.processProfile(dto.username);
        return { message: "OK" };
    }
} 