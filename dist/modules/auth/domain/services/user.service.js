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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("../../../../core/domain/services/base.service");
let UserService = class UserService extends base_service_1.BaseService {
    constructor(repository) {
        super(repository);
        this.repository = repository;
    }
    async findByEmail(email) {
        return this.repository.findByEmail(email);
    }
    async findByWhatsapp(whatsapp) {
        return this.repository.findByWhatsapp(whatsapp);
    }
    async updateActivationCode(id, code, expiresAt) {
        return this.repository.updateActivationCode(id, code, expiresAt);
    }
    async updateLoginCode(id, code, expiresAt) {
        return this.repository.updateLoginCode(id, code, expiresAt);
    }
    async verifyUser(id) {
        return this.repository.verifyUser(id);
    }
    async updateLastLogin(id) {
        return this.repository.updateLastLogin(id);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IUserRepository')),
    __metadata("design:paramtypes", [Object])
], UserService);
//# sourceMappingURL=user.service.js.map