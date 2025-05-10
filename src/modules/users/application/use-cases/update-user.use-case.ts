import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { UserNotFoundError } from '../../domain/errors/user-not-found.error';

interface UpdateUserDto {
    id: string;
    name?: string;
}

@Injectable()
export class UpdateUserUseCase {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
    ) { }

    async execute(data: UpdateUserDto): Promise<User> {
        const user = await this.userRepository.findById(data.id);
        if (!user) {
            throw new UserNotFoundError(data.id);
        }

        if (data.name) {
            user.updateName(data.name);
        }

        return this.userRepository.update(user);
    }
} 