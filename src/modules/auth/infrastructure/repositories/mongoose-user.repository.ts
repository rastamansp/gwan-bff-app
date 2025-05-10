import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IUserRepository } from "../../domain/repositories/user.repository.interface";
import { User, UserDocument } from "../../domain/entities/user.entity";

@Injectable()
export class MongooseUserRepository implements IUserRepository {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
    ) { }

    async findById(id: string): Promise<User | null> {
        const user = await this.userModel.findById(id).exec();
        return user ? user.toObject() : null;
    }

    async findAll(): Promise<User[]> {
        const users = await this.userModel.find().exec();
        return users.map(user => user.toObject());
    }

    async create(data: Partial<User>): Promise<User> {
        const user = await this.userModel.create(data);
        return user.toObject();
    }

    async update(id: string, data: Partial<User>): Promise<User> {
        const user = await this.userModel
            .findByIdAndUpdate(id, data, { new: true })
            .exec();
        return user.toObject();
    }

    async delete(id: string): Promise<void> {
        await this.userModel.findByIdAndDelete(id).exec();
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.userModel.findOne({ email }).exec();
        return user ? user.toObject() : null;
    }

    async findByWhatsApp(whatsapp: string): Promise<User | null> {
        const user = await this.userModel.findOne({ whatsapp }).exec();
        return user ? user.toObject() : null;
    }

    async findByVerificationCode(code: string): Promise<User | null> {
        const user = await this.userModel.findOne({ activationCode: code }).exec();
        return user ? user.toObject() : null;
    }

    async updateVerificationStatus(userId: string, isVerified: boolean): Promise<void> {
        await this.userModel.findByIdAndUpdate(userId, { isVerified });
    }

    async updateVerificationCode(userId: string, code: string, expiresAt: Date): Promise<void> {
        await this.userModel.findByIdAndUpdate(userId, {
            verificationCode: code,
            verificationCodeExpiresAt: expiresAt
        });
    }

    async updateLoginCode(userId: string, code: string, expiresAt: Date): Promise<void> {
        await this.userModel
            .findByIdAndUpdate(userId, {
                loginCode: code,
                loginCodeExpiresAt: expiresAt,
            })
            .exec();
    }

    async clearLoginCode(userId: string): Promise<void> {
        await this.userModel
            .findByIdAndUpdate(userId, {
                loginCode: null,
                loginCodeExpiresAt: null,
            })
            .exec();
    }

    async updateActivationCode(userId: string, code: string, expiresAt: Date): Promise<void> {
        await this.userModel
            .findByIdAndUpdate(userId, {
                activationCode: code,
                activationCodeExpiresAt: expiresAt,
            })
            .exec();
    }

    async clearActivationCode(userId: string): Promise<void> {
        await this.userModel
            .findByIdAndUpdate(userId, {
                activationCode: null,
                activationCodeExpiresAt: null,
            })
            .exec();
    }

    async verifyUser(userId: string): Promise<void> {
        await this.userModel
            .findByIdAndUpdate(userId, {
                isVerified: true,
                isEmailVerified: true,
            })
            .exec();
    }

    async updateLastLogin(userId: string): Promise<void> {
        await this.userModel
            .findByIdAndUpdate(userId, {
                lastLoginAt: new Date(),
            })
            .exec();
    }

    async deleteMany(filter: any): Promise<void> {
        await this.userModel.deleteMany(filter).exec();
    }

    async updatePassword(userId: string, hashedPassword: string): Promise<void> {
        await this.userModel
            .findByIdAndUpdate(userId, { password: hashedPassword })
            .exec();
    }
} 