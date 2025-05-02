import { User } from "../entities/user.entity";
import { UserService } from "../services/user.service";
import { BaseUseCase } from "../../../../core/domain/use-cases/base.use-case";
import { JwtService } from "@nestjs/jwt";
export declare class VerifyLoginUseCase extends BaseUseCase<User> {
    private readonly userService;
    private readonly jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    execute(data: {
        email: string;
        code: string;
    }): Promise<{
        user: User;
        token: string;
    }>;
}
