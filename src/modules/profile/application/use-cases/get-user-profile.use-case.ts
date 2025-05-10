import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { USER_REPOSITORY } from '../../domain/tokens/injection.tokens';

@Injectable()
export class GetUserProfileUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository
    ) { }

    async execute(userId: string): Promise<User> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }
} 