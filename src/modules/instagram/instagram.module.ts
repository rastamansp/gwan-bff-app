import { Module } from "@nestjs/common";
import { InstagramController } from "./infrastructure/controllers/instagram.controller";
import { InstagramService } from "./domain/services/instagram.service";
import { ProcessInstagramProfileUseCase } from "./domain/use-cases/process-instagram-profile.use-case";

@Module({
    controllers: [InstagramController],
    providers: [
        InstagramService,
        ProcessInstagramProfileUseCase,
    ],
})
export class InstagramModule { } 