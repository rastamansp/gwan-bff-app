"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelloRepositoryImpl = void 0;
const common_1 = require("@nestjs/common");
let HelloRepositoryImpl = class HelloRepositoryImpl {
    async findById(id) {
        throw new Error('Method not implemented.');
    }
    async findAll() {
        throw new Error('Method not implemented.');
    }
    async create(data) {
        throw new Error('Method not implemented.');
    }
    async update(id, data) {
        throw new Error('Method not implemented.');
    }
    async delete(id) {
        throw new Error('Method not implemented.');
    }
};
exports.HelloRepositoryImpl = HelloRepositoryImpl;
exports.HelloRepositoryImpl = HelloRepositoryImpl = __decorate([
    (0, common_1.Injectable)()
], HelloRepositoryImpl);
//# sourceMappingURL=hello.repository.impl.js.map