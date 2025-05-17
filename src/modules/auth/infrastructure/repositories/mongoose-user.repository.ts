import { Injectable, Logger } from "@nestjs/common";
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

    private transformUser(user: any): User | null {
        if (!user) return null;
        const userObject = user.toObject();
        return {
            ...userObject,
            id: userObject._id.toString(),
            _id: undefined
        };
    }

    async findById(id: string): Promise<User | null> {
        const user = await this.userModel.findById(id).exec();
        return this.transformUser(user);
    }

    async findAll(): Promise<User[]> {
        const users = await this.userModel.find().exec();
        return users.map(user => this.transformUser(user));
    }

    async create(data: Partial<User>): Promise<User> {
        const user = await this.userModel.create(data);
        return this.transformUser(user);
    }

    async update(id: string, data: Partial<User>): Promise<User> {
        const user = await this.userModel
            .findByIdAndUpdate(id, data, { new: true })
            .exec();
        return this.transformUser(user);
    }

    async delete(id: string): Promise<void> {
        await this.userModel.findByIdAndDelete(id).exec();
    }

    async findByEmail(email: string): Promise<User | null> {
        const logger = new Logger('MongooseUserRepository');
        logger.debug(`[FindByEmail] Executando query com email: "${email}"`);

        // Log collection details
        const collectionName = this.userModel.collection.name;
        const dbName = this.userModel.db.name;
        logger.debug(`[FindByEmail] Buscando na collection: ${collectionName} do banco: ${dbName}`);

        // Try a direct query first
        const directResult = await this.userModel.db.collection(collectionName).findOne({ email });
        logger.debug(`[FindByEmail] Resultado da query direta: ${directResult ? 'Encontrado' : 'Não encontrado'}`);
        if (directResult) {
            logger.debug(`[FindByEmail] Detalhes do usuário (query direta): ${JSON.stringify(directResult)}`);
        }

        // Then try the mongoose query
        const user = await this.userModel.findOne({ email }).exec();
        logger.debug(`[FindByEmail] Resultado da query Mongoose: ${user ? 'Usuário encontrado' : 'Usuário não encontrado'}`);
        if (user) {
            logger.debug(`[FindByEmail] Detalhes do usuário (Mongoose): ${JSON.stringify(user.toObject())}`);
        }

        return this.transformUser(user);
    }

    async findByWhatsApp(whatsapp: string): Promise<User | null> {
        const user = await this.userModel.findOne({ whatsapp }).exec();
        return this.transformUser(user);
    }

    async findByVerificationCode(code: string): Promise<User | null> {
        const user = await this.userModel.findOne({ activationCode: code }).exec();
        return this.transformUser(user);
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