import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { BaseMongoRepository } from '../../../../core/infrastructure/repositories/base-mongo.repository';

@Injectable()
export class UserRepository extends BaseMongoRepository<User> implements IUserRepository {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
    ) {
        super(userModel);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async findByWhatsApp(whatsapp: string): Promise<User | null> {
        return this.userModel.findOne({ whatsapp }).exec();
    }

    async updateProfile(userId: string, data: Partial<User>): Promise<User> {
        return this.userModel
            .findByIdAndUpdate(userId, { $set: data }, { new: true })
            .exec();
    }
} 