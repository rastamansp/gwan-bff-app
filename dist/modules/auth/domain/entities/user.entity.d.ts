import { Document } from "mongoose";
import { BaseEntity } from "../../../../core/domain/entities/base.entity";
export declare class User extends BaseEntity {
    name: string;
    email: string;
    whatsapp: string;
    isActive: boolean;
    isVerified: boolean;
    activationCode?: string;
    activationCodeExpiresAt?: Date;
    loginCode?: string;
    loginCodeExpiresAt?: Date;
    lastLoginAt?: Date;
}
export type UserDocument = User & Document;
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any> & User & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
