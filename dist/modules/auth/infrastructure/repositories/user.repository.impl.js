"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepositoryImpl = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let UserRepositoryImpl = class UserRepositoryImpl {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async findById(id) {
        return this.userModel.findById(id).exec();
    }
    async findAll() {
        return this.userModel.find().exec();
    }
    async create(data) {
        const userData = {
            name: data.name,
            email: data.email,
            whatsapp: data.whatsapp,
            isActive: data.isActive ?? true,
            isVerified: data.isVerified ?? false,
        };
        const user = new this.userModel(userData);
        return user.save();
    }
    async update(id, data) {
        return this.userModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }
    async delete(id) {
        await this.userModel.findByIdAndDelete(id).exec();
    }
    async findByEmail(email) {
        return this.userModel.findOne({ email }).exec();
    }
    async findByWhatsapp(whatsapp) {
        return this.userModel.findOne({ whatsapp }).exec();
    }
    async updateActivationCode(id, code, expiresAt) {
        return this.userModel.findByIdAndUpdate(id, { activationCode: code, activationCodeExpiresAt: expiresAt }, { new: true }).exec();
    }
    async updateLoginCode(id, code, expiresAt) {
        return this.userModel.findByIdAndUpdate(id, { loginCode: code, loginCodeExpiresAt: expiresAt }, { new: true }).exec();
    }
    async verifyUser(id) {
        return this.userModel.findByIdAndUpdate(id, {
            isVerified: true,
            activationCode: null,
            activationCodeExpiresAt: null,
            loginCode: null,
            loginCodeExpiresAt: null
        }, { new: true }).exec();
    }
    async updateLastLogin(id) {
        return this.userModel.findByIdAndUpdate(id, { lastLoginAt: new Date() }, { new: true }).exec();
    }
};
exports.UserRepositoryImpl = UserRepositoryImpl;
exports.UserRepositoryImpl = UserRepositoryImpl = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UserRepositoryImpl);
//# sourceMappingURL=user.repository.impl.js.map