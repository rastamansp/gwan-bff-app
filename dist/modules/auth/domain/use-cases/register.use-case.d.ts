import { User } from "../entities/user.entity";
import { UserService } from "../services/user.service";
import { NotificationService } from "../services/notification.service";
import { BaseUseCase } from "../../../../core/domain/use-cases/base.use-case";
export declare class RegisterUseCase extends BaseUseCase<User> {
    private readonly userService;
    private readonly notificationService;
    private readonly logger;
    constructor(userService: UserService, notificationService: NotificationService);
    execute(data: {
        name: string;
        email: string;
        whatsapp: string;
    }): Promise<User>;
}
