import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { UpdateProfileDto } from '../dto/update-profile.dto';

@Injectable()
export class ProfileService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
    ) { }

    async getProfile(userId: string): Promise<User> {
        return this.userModel.findById(userId).select('-password').exec();
    }

    async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<User> {
        return this.userModel
            .findByIdAndUpdate(
                userId,
                {
                    $set: {
                        name: updateProfileDto.name,
                        whatsapp: updateProfileDto.whatsapp,
                        updatedAt: new Date(),
                    },
                },
                { new: true }
            )
            .select('-password')
            .exec();
    }
} 