"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelloModule = void 0;
const common_1 = require("@nestjs/common");
const hello_controller_1 = require("./infrastructure/controllers/hello.controller");
const hello_service_1 = require("./domain/services/hello.service");
const get_hello_use_case_1 = require("./domain/use-cases/get-hello.use-case");
const hello_repository_impl_1 = require("./infrastructure/repositories/hello.repository.impl");
const hello_tokens_1 = require("./domain/tokens/hello.tokens");
let HelloModule = class HelloModule {
};
exports.HelloModule = HelloModule;
exports.HelloModule = HelloModule = __decorate([
    (0, common_1.Module)({
        controllers: [hello_controller_1.HelloController],
        providers: [
            {
                provide: hello_tokens_1.HELLO_REPOSITORY,
                useClass: hello_repository_impl_1.HelloRepositoryImpl,
            },
            hello_service_1.HelloService,
            get_hello_use_case_1.GetHelloUseCase,
        ],
    })
], HelloModule);
//# sourceMappingURL=hello.module.js.map