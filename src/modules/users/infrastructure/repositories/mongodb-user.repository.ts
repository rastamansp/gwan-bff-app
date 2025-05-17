import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { User as MongooseUser } from '../../../auth/domain/entities/user.entity';

@Injectable()
export class MongoDBUserRepository implements IUserRepository {
    constructor(
        @InjectModel(MongooseUser.name) private readonly userModel: Model<MongooseUser>,
    ) { }

    async findById(id: string): Promise<User | null> {
        const user = await this.userModel.findById(id).exec();
        if (!user) {
            return null;
        }

        return User.create(
            user._id.toString(),
            user.name,
            user.email,
            user.isVerified
        );
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.userModel.findOne({ email }).exec();
        if (!user) {
            return null;
        }

        return User.create(
            user._id.toString(),
            user.name,
            user.email,
            user.isVerified
        );
    }

    async create(user: User): Promise<User> {
        const created = await this.userModel.create({
            name: user.name,
            email: user.email,
            isVerified: user.isVerified
        });

        return User.create(
            created._id.toString(),
            created.name,
            created.email,
            created.isVerified
        );
    }

    async update(user: User): Promise<User> {
        const updated = await this.userModel
            .findByIdAndUpdate(
                user.id,
                {
                    name: user.name,
                    email: user.email,
                    isVerified: user.isVerified
                },
                { new: true }
            )
            .exec();

        if (!updated) {
            return null;
        }

        return User.create(
            updated._id.toString(),
            updated.name,
            updated.email,
            updated.isVerified
        );
    }

    async delete(id: string): Promise<void> {
        await this.userModel.findByIdAndDelete(id).exec();
    }

    async list(): Promise<User[]> {
        const users = await this.userModel.find().exec();
        return users.map(user =>
            User.create(
                user._id.toString(),
                user.name,
                user.email,
                user.isVerified
            )
        );
    }
} 