import { Injectable, Inject } from '@nestjs/common';
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
            throw new Error('User not found');
        }

        // Atualiza apenas os campos permitidos
        const allowedFields = ['name', 'description'];
        const updateData = Object.keys(data)
            .filter(key => allowedFields.includes(key))
            .reduce((obj, key) => {
                obj[key] = data[key];
                return obj;
            }, {});

        return this.userRepository.updateProfile(userId, updateData);
    }
} 