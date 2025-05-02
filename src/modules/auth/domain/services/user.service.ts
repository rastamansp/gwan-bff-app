import { Injectable, Inject } from "@nestjs/common";
import { User } from "../entities/user.entity";
import { IUserRepository } from "../repositories/user.repository";
import { BaseService } from "../../../../core/domain/services/base.service";

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @Inject("IUserRepository")
    protected readonly repository: IUserRepository,
  ) {
    super(repository);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findByEmail(email);
  }

  async findByWhatsapp(whatsapp: string): Promise<User | null> {
    return this.repository.findByWhatsapp(whatsapp);
  }

  async updateActivationCode(
    id: string,
    code: string,
    expiresAt: Date,
  ): Promise<User> {
    return this.repository.updateActivationCode(id, code, expiresAt);
  }

  async updateLoginCode(
    id: string,
    code: string,
    expiresAt: Date,
  ): Promise<User> {
    return this.repository.updateLoginCode(id, code, expiresAt);
  }

  async verifyUser(id: string): Promise<User> {
    return this.repository.verifyUser(id);
  }

  async updateLastLogin(id: string): Promise<User> {
    return this.repository.updateLastLogin(id);
  }
}
