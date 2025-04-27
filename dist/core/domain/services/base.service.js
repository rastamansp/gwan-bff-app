"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
class BaseService {
    constructor(repository) {
        this.repository = repository;
    }
    async findById(id) {
        return this.repository.findById(id);
    }
    async findAll() {
        return this.repository.findAll();
    }
    async create(data) {
        return this.repository.create(data);
    }
    async update(id, data) {
        return this.repository.update(id, data);
    }
    async delete(id) {
        return this.repository.delete(id);
    }
}
exports.BaseService = BaseService;
//# sourceMappingURL=base.service.js.map