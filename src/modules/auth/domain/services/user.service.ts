import { Injectable, Logger, Inject } from '@nestjs/common';
import { BaseService } from '../../../../core/domain/services/base.service';
import { User } from '../entities/user.entity';
import { IUserRepository } from '../repositories/user.repository.interface';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService extends BaseService<User> {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {
    super(userRepository);
  }

  async findByEmail(email: string): Promise<User | null> {
    this.logger.debug(`[FindByEmail] Buscando usuário por email: ${email}`);
    return this.userRepository.findByEmail(email);
  }

  async findByWhatsApp(whatsapp: string): Promise<User | null> {
    this.logger.debug(`[FindByWhatsApp] Buscando usuário por WhatsApp: ${whatsapp}`);
    return this.userRepository.findByWhatsApp(whatsapp);
  }

  async findByVerificationCode(code: string): Promise<User | null> {
    this.logger.debug(`[FindByVerificationCode] Buscando usuário por código: ${code}`);
    return this.userRepository.findByVerificationCode(code);
  }

  async updateVerificationStatus(userId: string, isVerified: boolean): Promise<User> {
    this.logger.debug(`[UpdateVerificationStatus] Atualizando status de verificação: ${userId}`);
    await this.userRepository.updateVerificationStatus(userId, isVerified);
    return this.userRepository.findById(userId);
  }

  async updateVerificationCode(
    userId: string,
    code: string,
    expiresAt: Date,
  ): Promise<User> {
    this.logger.debug(`[UpdateVerificationCode] Atualizando código de verificação: ${userId}`);
    await this.userRepository.updateVerificationCode(userId, code, expiresAt);
    return this.userRepository.findById(userId);
  }

  async updateLoginCode(
    userId: string,
    code: string,
    expiresAt: Date,
  ): Promise<User> {
    this.logger.debug(`[UpdateLoginCode] Atualizando código de login: ${userId}`);
    await this.userRepository.updateLoginCode(userId, code, expiresAt);
    return this.userRepository.findById(userId);
  }

  async clearLoginCode(userId: string): Promise<User> {
    this.logger.debug(`[ClearLoginCode] Limpando código de login: ${userId}`);
    await this.userRepository.clearLoginCode(userId);
    return this.userRepository.findById(userId);
  }

  async updateActivationCode(
    userId: string,
    code: string,
    expiresAt: Date,
  ): Promise<User> {
    this.logger.debug(`[UpdateActivationCode] Atualizando código de ativação: ${userId}`);
    await this.userRepository.updateActivationCode(userId, code, expiresAt);
    return this.userRepository.findById(userId);
  }

  async clearActivationCode(userId: string): Promise<User> {
    this.logger.debug(`[ClearActivationCode] Limpando código de ativação: ${userId}`);
    await this.userRepository.clearActivationCode(userId);
    return this.userRepository.findById(userId);
  }

  async verifyUser(userId: string): Promise<User> {
    this.logger.debug(`[VerifyUser] Verificando usuário: ${userId}`);
    await this.userRepository.verifyUser(userId);
    return this.userRepository.findById(userId);
  }

  async updateLastLogin(userId: string): Promise<User> {
    this.logger.debug(`[UpdateLastLogin] Atualizando último login: ${userId}`);
    await this.userRepository.updateLastLogin(userId);
    return this.userRepository.findById(userId);
  }

  async deleteMany(filter: any): Promise<void> {
    this.logger.debug(`[DeleteMany] Removendo usuários com filtro: ${JSON.stringify(filter)}`);
    await this.userRepository.deleteMany(filter);
  }

  async updatePassword(userId: string, password: string): Promise<User> {
    this.logger.debug(`[UpdatePassword] Atualizando senha do usuário: ${userId}`);
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userRepository.updatePassword(userId, hashedPassword);
    return this.userRepository.findById(userId);
  }
}
