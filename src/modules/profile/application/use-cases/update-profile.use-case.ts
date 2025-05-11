import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { USER_REPOSITORY } from '../../domain/tokens/injection.tokens';

@Injectable()
export class UpdateProfileUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository
    ) { }

    async execute(userId: string, data: UpdateProfileDto): Promise<User> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }

        // Atualiza apenas os campos permitidos
        const allowedFields = ['name', 'description', 'whatsapp'];
        const updateData = Object.keys(data)
            .filter(key => allowedFields.includes(key))
            .reduce((obj, key) => {
                obj[key] = data[key];
                return obj;
            }, {});

        if (Object.keys(updateData).length === 0) {
            throw new BadRequestException('Nenhum campo válido para atualização');
        }

        return this.userRepository.updateProfile(userId, updateData);
    }
} 