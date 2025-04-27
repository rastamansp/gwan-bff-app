import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async create(data: Partial<User>): Promise<User> {
    const user = new this.userModel(data);
    return user.save();
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByWhatsapp(whatsapp: string): Promise<User | null> {
    return this.userModel.findOne({ whatsapp }).exec();
  }

  async updateActivationCode(id: string, code: string, expiresAt: Date): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      id,
      { activationCode: code, activationCodeExpiresAt: expiresAt },
      { new: true }
    ).exec();
  }

  async updateLoginCode(id: string, code: string, expiresAt: Date): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      id,
      { loginCode: code, loginCodeExpiresAt: expiresAt },
      { new: true }
    ).exec();
  }

  async verifyUser(id: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      id,
      { 
        isVerified: true, 
        activationCode: null, 
        activationCodeExpiresAt: null,
        loginCode: null,
        loginCodeExpiresAt: null
      },
      { new: true }
    ).exec();
  }

  async updateLastLogin(id: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      id,
      { lastLoginAt: new Date() },
      { new: true }
    ).exec();
  }
} 