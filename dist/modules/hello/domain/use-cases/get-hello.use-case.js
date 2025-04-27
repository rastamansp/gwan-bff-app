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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetHelloUseCase = void 0;
const common_1 = require("@nestjs/common");
const hello_service_1 = require("../services/hello.service");
const base_use_case_1 = require("../../../../core/domain/use-cases/base.use-case");
let GetHelloUseCase = class GetHelloUseCase extends base_use_case_1.BaseUseCase {
    constructor(helloService) {
        super(helloService);
        this.helloService = helloService;
    }
    async execute() {
        return this.helloService.getHelloMessage();
    }
};
exports.GetHelloUseCase = GetHelloUseCase;
exports.GetHelloUseCase = GetHelloUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [hello_service_1.HelloService])
], GetHelloUseCase);
//# sourceMappingURL=get-hello.use-case.js.map