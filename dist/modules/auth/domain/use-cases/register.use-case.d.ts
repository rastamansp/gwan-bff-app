import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { BaseUseCase } from '../../../../core/domain/use-cases/base.use-case';
export declare class RegisterUseCase extends BaseUseCase<User> {
    private readonly userService;
    constructor(userService: UserService);
    execute(data: {
        name: string;
        email: string;
        whatsapp: string;
    }): Promise<User>;
}
