/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(3);
const config_1 = __webpack_require__(5);
const mongoose_1 = __webpack_require__(6);
const app_controller_1 = __webpack_require__(7);
const app_service_1 = __webpack_require__(8);
const hello_module_1 = __webpack_require__(9);
const auth_module_1 = __webpack_require__(18);
const health_module_1 = __webpack_require__(39);
const email_module_1 = __webpack_require__(41);
const dataset_module_1 = __webpack_require__(44);
const knowledge_module_1 = __webpack_require__(53);
const rabbitmq_module_1 = __webpack_require__(64);
const users_module_1 = __webpack_require__(65);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ".env",
                expandVariables: true,
                cache: true,
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => {
                    const uri = configService.get("MONGODB_URI") ||
                        "mongodb://gwan:pazdeDeus2025@mongodb.gwan.com.br:27017/gwan?authSource=admin";
                    return { uri };
                },
                inject: [config_1.ConfigService],
            }),
            hello_module_1.HelloModule,
            auth_module_1.AuthModule,
            health_module_1.HealthModule,
            email_module_1.EmailWorkerModule,
            dataset_module_1.DatasetModule,
            knowledge_module_1.KnowledgeModule,
            rabbitmq_module_1.RabbitMQModule,
            users_module_1.UsersModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);


/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("@nestjs/mongoose");

/***/ }),
/* 7 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const common_1 = __webpack_require__(3);
const app_service_1 = __webpack_require__(8);
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        return this.appService.getHello();
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof app_service_1.AppService !== "undefined" && app_service_1.AppService) === "function" ? _a : Object])
], AppController);


/***/ }),
/* 8 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const common_1 = __webpack_require__(3);
let AppService = class AppService {
    getHello() {
        return "Hello World!";
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);


/***/ }),
/* 9 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HelloModule = void 0;
const common_1 = __webpack_require__(3);
const hello_controller_1 = __webpack_require__(10);
const hello_service_1 = __webpack_require__(12);
const get_hello_use_case_1 = __webpack_require__(11);
const hello_repository_impl_1 = __webpack_require__(17);
const hello_tokens_1 = __webpack_require__(15);
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


/***/ }),
/* 10 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HelloController = void 0;
const common_1 = __webpack_require__(3);
const get_hello_use_case_1 = __webpack_require__(11);
let HelloController = class HelloController {
    constructor(getHelloUseCase) {
        this.getHelloUseCase = getHelloUseCase;
    }
    async getHello() {
        return this.getHelloUseCase.execute();
    }
};
exports.HelloController = HelloController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_b = typeof Promise !== "undefined" && Promise) === "function" ? _b : Object)
], HelloController.prototype, "getHello", null);
exports.HelloController = HelloController = __decorate([
    (0, common_1.Controller)("hello"),
    __metadata("design:paramtypes", [typeof (_a = typeof get_hello_use_case_1.GetHelloUseCase !== "undefined" && get_hello_use_case_1.GetHelloUseCase) === "function" ? _a : Object])
], HelloController);


/***/ }),
/* 11 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetHelloUseCase = void 0;
const common_1 = __webpack_require__(3);
const hello_service_1 = __webpack_require__(12);
const base_use_case_1 = __webpack_require__(16);
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
    __metadata("design:paramtypes", [typeof (_a = typeof hello_service_1.HelloService !== "undefined" && hello_service_1.HelloService) === "function" ? _a : Object])
], GetHelloUseCase);


/***/ }),
/* 12 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HelloService = void 0;
const common_1 = __webpack_require__(3);
const hello_repository_1 = __webpack_require__(13);
const base_service_1 = __webpack_require__(14);
const hello_tokens_1 = __webpack_require__(15);
let HelloService = class HelloService extends base_service_1.BaseService {
    constructor(repository) {
        super(repository);
        this.repository = repository;
    }
    async getHelloMessage() {
        return "Hello World!";
    }
};
exports.HelloService = HelloService;
exports.HelloService = HelloService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(hello_tokens_1.HELLO_REPOSITORY)),
    __metadata("design:paramtypes", [typeof (_a = typeof hello_repository_1.IHelloRepository !== "undefined" && hello_repository_1.IHelloRepository) === "function" ? _a : Object])
], HelloService);


/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
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


/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HELLO_REPOSITORY = void 0;
exports.HELLO_REPOSITORY = "HELLO_REPOSITORY";


/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseUseCase = void 0;
class BaseUseCase {
    constructor(service) {
        this.service = service;
    }
}
exports.BaseUseCase = BaseUseCase;


/***/ }),
/* 17 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HelloRepositoryImpl = void 0;
const common_1 = __webpack_require__(3);
let HelloRepositoryImpl = class HelloRepositoryImpl {
    async findById(id) {
        throw new Error("Method not implemented.");
    }
    async findAll() {
        throw new Error("Method not implemented.");
    }
    async create(data) {
        throw new Error("Method not implemented.");
    }
    async update(id, data) {
        throw new Error("Method not implemented.");
    }
    async delete(id) {
        throw new Error("Method not implemented.");
    }
};
exports.HelloRepositoryImpl = HelloRepositoryImpl;
exports.HelloRepositoryImpl = HelloRepositoryImpl = __decorate([
    (0, common_1.Injectable)()
], HelloRepositoryImpl);


/***/ }),
/* 18 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(6);
const jwt_1 = __webpack_require__(19);
const auth_controller_1 = __webpack_require__(20);
const user_service_1 = __webpack_require__(22);
const register_use_case_1 = __webpack_require__(21);
const verify_code_use_case_1 = __webpack_require__(27);
const login_use_case_1 = __webpack_require__(28);
const verify_login_use_case_1 = __webpack_require__(29);
const user_repository_impl_1 = __webpack_require__(30);
const user_entity_1 = __webpack_require__(32);
const notification_service_1 = __webpack_require__(24);
const rabbitmq_service_1 = __webpack_require__(25);
const jwt_strategy_1 = __webpack_require__(34);
const guards_1 = __webpack_require__(37);
const core_1 = __webpack_require__(1);
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: user_entity_1.User.name, schema: user_entity_1.UserSchema }]),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || "gwan-secret-key-production-2024",
                signOptions: { expiresIn: process.env.JWT_EXPIRATION || "1d" },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            user_service_1.UserService,
            register_use_case_1.RegisterUseCase,
            verify_code_use_case_1.VerifyCodeUseCase,
            login_use_case_1.LoginUseCase,
            verify_login_use_case_1.VerifyLoginUseCase,
            user_repository_impl_1.UserRepositoryImpl,
            notification_service_1.NotificationService,
            rabbitmq_service_1.RabbitMQService,
            jwt_strategy_1.JwtStrategy,
            guards_1.JwtAuthGuard,
            {
                provide: core_1.APP_GUARD,
                useClass: guards_1.JwtAuthGuard,
            },
            {
                provide: "IUserRepository",
                useClass: user_repository_impl_1.UserRepositoryImpl,
            },
        ],
        exports: [user_service_1.UserService, jwt_strategy_1.JwtStrategy],
    })
], AuthModule);


/***/ }),
/* 19 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 20 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var AuthController_1;
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(3);
const swagger_1 = __webpack_require__(2);
const register_use_case_1 = __webpack_require__(21);
const verify_code_use_case_1 = __webpack_require__(27);
const login_use_case_1 = __webpack_require__(28);
const verify_login_use_case_1 = __webpack_require__(29);
let AuthController = AuthController_1 = class AuthController {
    constructor(registerUseCase, verifyCodeUseCase, loginUseCase, verifyLoginUseCase) {
        this.registerUseCase = registerUseCase;
        this.verifyCodeUseCase = verifyCodeUseCase;
        this.loginUseCase = loginUseCase;
        this.verifyLoginUseCase = verifyLoginUseCase;
        this.logger = new common_1.Logger(AuthController_1.name);
    }
    async register(data) {
        this.logger.log(`[Register] Iniciando processo de registro para ${data.email}`);
        this.logger.debug(`[Register] Dados recebidos: ${JSON.stringify({
            name: data.name,
            email: data.email,
            whatsapp: data.whatsapp,
        })}`);
        try {
            const result = await this.registerUseCase.execute(data);
            this.logger.log(`[Register] Registro concluído com sucesso para ${data.email}`);
            return result;
        }
        catch (error) {
            this.logger.error(`[Register] Erro no registro para ${data.email}: ${error.message}`, error.stack);
            throw error;
        }
    }
    async verify(data) {
        this.logger.log(`[Verify] Iniciando verificação de código para ${data.email}`);
        try {
            const result = await this.verifyCodeUseCase.execute(data);
            this.logger.log(`[Verify] Código verificado com sucesso para ${data.email}`);
            return result;
        }
        catch (error) {
            this.logger.error(`[Verify] Erro na verificação para ${data.email}: ${error.message}`, error.stack);
            throw error;
        }
    }
    async login(data) {
        this.logger.log(`[Login] Iniciando processo de login para ${data.email}`);
        try {
            const result = await this.loginUseCase.execute(data);
            this.logger.log(`[Login] Código de login enviado com sucesso para ${data.email}`);
            return result;
        }
        catch (error) {
            this.logger.error(`[Login] Erro no login para ${data.email}: ${error.message}`, error.stack);
            throw error;
        }
    }
    async verifyLogin(data) {
        this.logger.log(`[VerifyLogin] Iniciando verificação de código de login para ${data.email}`);
        try {
            const result = await this.verifyLoginUseCase.execute(data);
            this.logger.log(`[VerifyLogin] Código de login verificado com sucesso para ${data.email}`);
            return result;
        }
        catch (error) {
            this.logger.error(`[VerifyLogin] Erro na verificação de login para ${data.email}: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)("register"),
    (0, swagger_1.ApiOperation)({ summary: "Register a new user" }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            properties: {
                name: { type: "string", example: "Pedro Almeida" },
                email: { type: "string", example: "pedro.hp.almeida@gmail.com" },
                whatsapp: { type: "string", example: "+5511999999999" },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "User registered successfully" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Invalid input data" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)("verify"),
    (0, swagger_1.ApiOperation)({ summary: "Verify activation code" }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            properties: {
                email: { type: "string", example: "pedro.hp.almeida@gmail.com" },
                code: { type: "string", example: "123456" },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Code verified successfully" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Invalid code" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verify", null);
__decorate([
    (0, common_1.Post)("login"),
    (0, swagger_1.ApiOperation)({ summary: "Request login" }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            properties: {
                email: { type: "string", example: "pedro.hp.almeida@gmail.com" },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Login code sent successfully" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Invalid credentials" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)("verify-login"),
    (0, swagger_1.ApiOperation)({ summary: "Verify login code" }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            properties: {
                email: { type: "string", example: "pedro.hp.almeida@gmail.com" },
                code: { type: "string", example: "123456" },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Login successful" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Invalid code" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyLogin", null);
exports.AuthController = AuthController = AuthController_1 = __decorate([
    (0, swagger_1.ApiTags)("auth"),
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [typeof (_a = typeof register_use_case_1.RegisterUseCase !== "undefined" && register_use_case_1.RegisterUseCase) === "function" ? _a : Object, typeof (_b = typeof verify_code_use_case_1.VerifyCodeUseCase !== "undefined" && verify_code_use_case_1.VerifyCodeUseCase) === "function" ? _b : Object, typeof (_c = typeof login_use_case_1.LoginUseCase !== "undefined" && login_use_case_1.LoginUseCase) === "function" ? _c : Object, typeof (_d = typeof verify_login_use_case_1.VerifyLoginUseCase !== "undefined" && verify_login_use_case_1.VerifyLoginUseCase) === "function" ? _d : Object])
], AuthController);


/***/ }),
/* 21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RegisterUseCase_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegisterUseCase = void 0;
const common_1 = __webpack_require__(3);
const user_service_1 = __webpack_require__(22);
const notification_service_1 = __webpack_require__(24);
const base_use_case_1 = __webpack_require__(16);
let RegisterUseCase = RegisterUseCase_1 = class RegisterUseCase extends base_use_case_1.BaseUseCase {
    constructor(userService, notificationService) {
        super(userService);
        this.userService = userService;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(RegisterUseCase_1.name);
    }
    async execute(data) {
        this.logger.log(`[Register] Iniciando fluxo de registro para usuário: ${data.email}`);
        this.logger.debug(`[Register] Dados de registro recebidos: ${JSON.stringify({
            name: data.name,
            email: data.email,
            whatsapp: data.whatsapp,
        })}`);
        try {
            this.logger.debug(`[Register] Verificando se email já está em uso: ${data.email}`);
            const existingUser = await this.userService.findByEmail(data.email);
            if (existingUser) {
                this.logger.warn(`[Register] Tentativa de registro com email já existente: ${data.email}`);
                throw new common_1.ConflictException({
                    message: "Email já está em uso",
                    code: "EMAIL_ALREADY_EXISTS",
                    details: {
                        email: data.email,
                    },
                });
            }
            this.logger.debug(`[Register] Email disponível para uso: ${data.email}`);
            this.logger.debug(`[Register] Verificando se WhatsApp já está em uso: ${data.whatsapp}`);
            const existingWhatsapp = await this.userService.findByWhatsapp(data.whatsapp);
            if (existingWhatsapp) {
                this.logger.warn(`[Register] Tentativa de registro com WhatsApp já existente: ${data.whatsapp}`);
                throw new common_1.ConflictException({
                    message: "WhatsApp já está em uso",
                    code: "WHATSAPP_ALREADY_EXISTS",
                    details: {
                        whatsapp: data.whatsapp,
                    },
                });
            }
            this.logger.debug(`[Register] WhatsApp disponível para uso: ${data.whatsapp}`);
            this.logger.log(`[Register] Criando novo usuário no banco de dados: ${data.email}`);
            const user = await this.userService.create({
                ...data,
                isActive: true,
                isVerified: false,
            });
            this.logger.log(`[Register] Usuário criado com sucesso. ID: ${user.id}, Email: ${user.email}`);
            const activationCode = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + 10);
            this.logger.debug(`[Register] Gerando código de verificação para usuário: ${user.id}`);
            await this.userService.updateActivationCode(user.id, activationCode, expiresAt);
            this.logger.debug(`[Register] Código de verificação gerado e salvo. Expira em: ${expiresAt.toISOString()}`);
            this.logger.log(`[Register] Iniciando envio de código por email: ${user.email}`);
            try {
                await this.notificationService.sendEmail(user.email, "Código de Verificação - GWAN", `Olá ${user.name},\n\nSeu código de verificação é: ${activationCode}\n\nEste código é válido por 10 minutos.`);
                this.logger.log(`[Register] Email de verificação enviado com sucesso: ${user.email}`);
            }
            catch (error) {
                this.logger.error(`[Register] Erro ao enviar email de verificação: ${error.message}`, error.stack);
            }
            this.logger.log(`[Register] Iniciando envio de código por WhatsApp: ${user.whatsapp}`);
            try {
                await this.notificationService.sendWhatsApp(user.whatsapp, `GWAN: Seu código de verificação é: ${activationCode}. Válido por 10 minutos.`);
                this.logger.log(`[Register] Mensagem WhatsApp enviada com sucesso: ${user.whatsapp}`);
            }
            catch (error) {
                this.logger.error(`[Register] Erro ao enviar mensagem WhatsApp: ${error.message}`, error.stack);
            }
            this.logger.log(`[Register] Processo de registro concluído com sucesso para: ${user.email}`);
            return user;
        }
        catch (error) {
            this.logger.error(`[Register] Erro durante o processo de registro: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.RegisterUseCase = RegisterUseCase;
exports.RegisterUseCase = RegisterUseCase = RegisterUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _a : Object, typeof (_b = typeof notification_service_1.NotificationService !== "undefined" && notification_service_1.NotificationService) === "function" ? _b : Object])
], RegisterUseCase);


/***/ }),
/* 22 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserService = void 0;
const common_1 = __webpack_require__(3);
const user_repository_1 = __webpack_require__(23);
const base_service_1 = __webpack_require__(14);
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
    __param(0, (0, common_1.Inject)("IUserRepository")),
    __metadata("design:paramtypes", [typeof (_a = typeof user_repository_1.IUserRepository !== "undefined" && user_repository_1.IUserRepository) === "function" ? _a : Object])
], UserService);


/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 24 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NotificationService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationService = void 0;
const common_1 = __webpack_require__(3);
const rabbitmq_service_1 = __webpack_require__(25);
let NotificationService = NotificationService_1 = class NotificationService {
    constructor(rabbitMQService) {
        this.rabbitMQService = rabbitMQService;
        this.logger = new common_1.Logger(NotificationService_1.name);
    }
    async sendEmail(to, subject, content) {
        try {
            this.logger.log(`Preparando envio de email para: ${to}`);
            const emailData = {
                to,
                subject,
                content,
                timestamp: new Date().toISOString(),
            };
            this.logger.log(`Enviando mensagem para fila email_notifications: ${JSON.stringify(emailData)}`);
            await this.rabbitMQService.sendToQueue("email_notifications", emailData);
            this.logger.log(`Mensagem enviada com sucesso para fila email_notifications`);
        }
        catch (error) {
            this.logger.error(`Erro ao enviar email para ${to}:`, error);
            throw error;
        }
    }
    async sendWhatsApp(to, message) {
        try {
            this.logger.log(`Preparando envio de WhatsApp para: ${to}`);
            const whatsappData = {
                to,
                message,
                timestamp: new Date().toISOString(),
            };
            this.logger.log(`Enviando mensagem para fila whatsapp_notifications: ${JSON.stringify(whatsappData)}`);
            await this.rabbitMQService.sendToQueue("whatsapp_notifications", whatsappData);
            this.logger.log(`Mensagem enviada com sucesso para fila whatsapp_notifications`);
        }
        catch (error) {
            this.logger.error(`Erro ao enviar WhatsApp para ${to}:`, error);
            throw error;
        }
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof rabbitmq_service_1.RabbitMQService !== "undefined" && rabbitmq_service_1.RabbitMQService) === "function" ? _a : Object])
], NotificationService);


/***/ }),
/* 25 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RabbitMQService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RabbitMQService = void 0;
const common_1 = __webpack_require__(3);
const config_1 = __webpack_require__(5);
const amqp = __webpack_require__(26);
let RabbitMQService = RabbitMQService_1 = class RabbitMQService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(RabbitMQService_1.name);
        this.connect();
    }
    async connect() {
        try {
            this.logger.log("Iniciando conexão com RabbitMQ...");
            const rabbitmqUri = this.configService.get("RABBITMQ_URL");
            if (!rabbitmqUri) {
                throw new Error("RABBITMQ_URI não está definida nas variáveis de ambiente");
            }
            const conn = await amqp.connect(rabbitmqUri);
            this.connection = conn;
            const ch = await conn.createChannel();
            this.channel = ch;
            this.logger.log("Declarando filas...");
            await this.channel.assertQueue("email_notifications", {
                durable: true,
                arguments: {
                    "x-message-ttl": 86400000,
                    "x-dead-letter-exchange": "email_notifications_dlx",
                    "x-dead-letter-routing-key": "email_notifications",
                },
            });
            await this.channel.assertQueue("whatsapp_notifications", {
                durable: true,
            });
            this.logger.log("Filas declaradas com sucesso");
            this.logger.log("[RabbitMQ] Conectado com sucesso");
        }
        catch (error) {
            this.logger.error("[RabbitMQ] Erro ao conectar:", error);
            this.logger.log("[RabbitMQ] Tentando reconectar em 5 segundos...");
            setTimeout(() => this.connect(), 5000);
        }
    }
    async sendToQueue(queue, message) {
        try {
            this.logger.log(`Verificando conexão com RabbitMQ para envio à fila ${queue}...`);
            if (!this.channel) {
                this.logger.log("Canal não encontrado, tentando reconectar...");
                await this.connect();
            }
            const messageBuffer = Buffer.from(JSON.stringify(message));
            this.logger.debug(`Enviando mensagem para fila ${queue}: ${messageBuffer.toString()}`);
            await this.channel.sendToQueue(queue, messageBuffer, {
                persistent: true,
            });
            this.logger.log(`[RabbitMQ] Mensagem enviada com sucesso para a fila ${queue}`);
        }
        catch (error) {
            this.logger.error(`[RabbitMQ] Erro ao enviar mensagem para a fila ${queue}:`, error);
            throw error;
        }
    }
    async closeConnection() {
        try {
            this.logger.log("Fechando conexão com RabbitMQ...");
            if (this.channel) {
                await this.channel.close();
                this.logger.log("Canal fechado com sucesso");
            }
            if (this.connection) {
                const conn = this.connection;
                await conn.close();
                this.logger.log("Conexão fechada com sucesso");
            }
        }
        catch (error) {
            this.logger.error("[RabbitMQ] Erro ao fechar conexão:", error);
        }
    }
};
exports.RabbitMQService = RabbitMQService;
exports.RabbitMQService = RabbitMQService = RabbitMQService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], RabbitMQService);


/***/ }),
/* 26 */
/***/ ((module) => {

module.exports = require("amqplib");

/***/ }),
/* 27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VerifyCodeUseCase = void 0;
const common_1 = __webpack_require__(3);
const user_service_1 = __webpack_require__(22);
const base_use_case_1 = __webpack_require__(16);
let VerifyCodeUseCase = class VerifyCodeUseCase extends base_use_case_1.BaseUseCase {
    constructor(userService) {
        super(userService);
        this.userService = userService;
    }
    async execute(data) {
        const user = await this.userService.findByEmail(data.email);
        if (!user) {
            throw new common_1.NotFoundException({
                message: "Usuário não encontrado",
                code: "USER_NOT_FOUND",
                details: {
                    email: data.email,
                },
            });
        }
        if (!user.activationCode || !user.activationCodeExpiresAt) {
            throw new common_1.BadRequestException({
                message: "Código de ativação não encontrado",
                code: "ACTIVATION_CODE_NOT_FOUND",
                details: {
                    email: data.email,
                },
            });
        }
        if (user.activationCode !== data.code) {
            throw new common_1.BadRequestException({
                message: "Código de ativação inválido",
                code: "INVALID_ACTIVATION_CODE",
                details: {
                    email: data.email,
                    providedCode: data.code,
                },
            });
        }
        if (user.activationCodeExpiresAt < new Date()) {
            throw new common_1.BadRequestException({
                message: "Código de ativação expirado",
                code: "ACTIVATION_CODE_EXPIRED",
                details: {
                    email: data.email,
                    expiresAt: user.activationCodeExpiresAt,
                },
            });
        }
        return this.userService.verifyUser(user.id);
    }
};
exports.VerifyCodeUseCase = VerifyCodeUseCase;
exports.VerifyCodeUseCase = VerifyCodeUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _a : Object])
], VerifyCodeUseCase);


/***/ }),
/* 28 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var LoginUseCase_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginUseCase = void 0;
const common_1 = __webpack_require__(3);
const user_service_1 = __webpack_require__(22);
const notification_service_1 = __webpack_require__(24);
const base_use_case_1 = __webpack_require__(16);
let LoginUseCase = LoginUseCase_1 = class LoginUseCase extends base_use_case_1.BaseUseCase {
    constructor(userService, notificationService) {
        super(userService);
        this.userService = userService;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(LoginUseCase_1.name);
    }
    async execute(data) {
        this.logger.log(`[Login] Iniciando processo de login para: ${data.email}`);
        try {
            this.logger.debug(`[Login] Buscando usuário por email: ${data.email}`);
            const user = await this.userService.findByEmail(data.email);
            if (!user) {
                this.logger.warn(`[Login] Usuário não encontrado: ${data.email}`);
                throw new common_1.NotFoundException({
                    message: "Usuário não encontrado",
                    code: "USER_NOT_FOUND",
                    details: {
                        email: data.email,
                    },
                });
            }
            if (!user.isVerified) {
                this.logger.warn(`[Login] Tentativa de login com usuário não verificado: ${data.email}`);
                throw new common_1.BadRequestException({
                    message: "Usuário não está verificado",
                    code: "USER_NOT_VERIFIED",
                    details: {
                        email: data.email,
                    },
                });
            }
            const loginCode = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + 10);
            this.logger.debug(`[Login] Gerando código de login para usuário: ${user.id}`);
            await this.userService.updateLoginCode(user.id, loginCode, expiresAt);
            this.logger.debug(`[Login] Código de login gerado e salvo. Expira em: ${expiresAt.toISOString()}`);
            this.logger.log(`[Login] Iniciando envio de código por email: ${user.email}`);
            try {
                await this.notificationService.sendEmail(user.email, "Código de Login - GWAN", `Olá ${user.name},\n\nSeu código de login é: ${loginCode}\n\nEste código é válido por 10 minutos.\n\nSe você não solicitou este código, ignore este email.`);
                this.logger.log(`[Login] Email com código de login enviado com sucesso: ${user.email}`);
            }
            catch (error) {
                this.logger.error(`[Login] Erro ao enviar email com código de login: ${error.message}`, error.stack);
                throw new common_1.BadRequestException({
                    message: "Erro ao enviar código de login por email",
                    code: "EMAIL_SEND_ERROR",
                    details: {
                        email: user.email,
                    },
                });
            }
            this.logger.log(`[Login] Iniciando envio de código por WhatsApp: ${user.whatsapp}`);
            try {
                await this.notificationService.sendWhatsApp(user.whatsapp, `GWAN: Seu código de login é: ${loginCode}. Válido por 10 minutos.`);
                this.logger.log(`[Login] Mensagem WhatsApp enviada com sucesso: ${user.whatsapp}`);
            }
            catch (error) {
                this.logger.error(`[Login] Erro ao enviar mensagem WhatsApp: ${error.message}`, error.stack);
            }
            this.logger.log(`[Login] Processo de login concluído com sucesso para: ${user.email}`);
            return user;
        }
        catch (error) {
            this.logger.error(`[Login] Erro durante o processo de login: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.LoginUseCase = LoginUseCase;
exports.LoginUseCase = LoginUseCase = LoginUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _a : Object, typeof (_b = typeof notification_service_1.NotificationService !== "undefined" && notification_service_1.NotificationService) === "function" ? _b : Object])
], LoginUseCase);


/***/ }),
/* 29 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VerifyLoginUseCase = void 0;
const common_1 = __webpack_require__(3);
const user_service_1 = __webpack_require__(22);
const base_use_case_1 = __webpack_require__(16);
const jwt_1 = __webpack_require__(19);
let VerifyLoginUseCase = class VerifyLoginUseCase extends base_use_case_1.BaseUseCase {
    constructor(userService, jwtService) {
        super(userService);
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async execute(data) {
        const user = await this.userService.findByEmail(data.email);
        if (!user) {
            throw new common_1.NotFoundException({
                message: "Usuário não encontrado",
                code: "USER_NOT_FOUND",
                details: {
                    email: data.email,
                },
            });
        }
        if (!user.loginCode || !user.loginCodeExpiresAt) {
            throw new common_1.BadRequestException({
                message: "Código de login não encontrado",
                code: "LOGIN_CODE_NOT_FOUND",
                details: {
                    email: data.email,
                },
            });
        }
        if (user.loginCode !== data.code) {
            throw new common_1.BadRequestException({
                message: "Código de login inválido",
                code: "INVALID_LOGIN_CODE",
                details: {
                    email: data.email,
                    providedCode: data.code,
                },
            });
        }
        if (user.loginCodeExpiresAt < new Date()) {
            throw new common_1.BadRequestException({
                message: "Código de login expirado",
                code: "LOGIN_CODE_EXPIRED",
                details: {
                    email: data.email,
                    expiresAt: user.loginCodeExpiresAt,
                },
            });
        }
        const updatedUser = await this.userService.updateLastLogin(user.id);
        const token = this.jwtService.sign({
            sub: updatedUser.id,
            email: updatedUser.email,
            name: updatedUser.name,
        });
        return {
            user: updatedUser,
            token,
        };
    }
};
exports.VerifyLoginUseCase = VerifyLoginUseCase;
exports.VerifyLoginUseCase = VerifyLoginUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object])
], VerifyLoginUseCase);


/***/ }),
/* 30 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserRepositoryImpl = void 0;
const common_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(6);
const mongoose_2 = __webpack_require__(31);
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
        return this.userModel
            .findByIdAndUpdate(id, { activationCode: code, activationCodeExpiresAt: expiresAt }, { new: true })
            .exec();
    }
    async updateLoginCode(id, code, expiresAt) {
        return this.userModel
            .findByIdAndUpdate(id, { loginCode: code, loginCodeExpiresAt: expiresAt }, { new: true })
            .exec();
    }
    async verifyUser(id) {
        return this.userModel
            .findByIdAndUpdate(id, {
            isVerified: true,
            activationCode: null,
            activationCodeExpiresAt: null,
            loginCode: null,
            loginCodeExpiresAt: null,
        }, { new: true })
            .exec();
    }
    async updateLastLogin(id) {
        return this.userModel
            .findByIdAndUpdate(id, { lastLoginAt: new Date() }, { new: true })
            .exec();
    }
};
exports.UserRepositoryImpl = UserRepositoryImpl;
exports.UserRepositoryImpl = UserRepositoryImpl = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)("User")),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], UserRepositoryImpl);


/***/ }),
/* 31 */
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),
/* 32 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserSchema = exports.User = void 0;
const mongoose_1 = __webpack_require__(6);
const base_entity_1 = __webpack_require__(33);
let User = class User extends base_entity_1.BaseEntity {
};
exports.User = User;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "whatsapp", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isVerified", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "activationCode", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], User.prototype, "activationCodeExpiresAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "loginCode", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], User.prototype, "loginCodeExpiresAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], User.prototype, "lastLoginAt", void 0);
exports.User = User = __decorate([
    (0, mongoose_1.Schema)()
], User);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);


/***/ }),
/* 33 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseEntity = void 0;
class BaseEntity {
}
exports.BaseEntity = BaseEntity;


/***/ }),
/* 34 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var JwtStrategy_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const common_1 = __webpack_require__(3);
const passport_1 = __webpack_require__(35);
const passport_jwt_1 = __webpack_require__(36);
const config_1 = __webpack_require__(5);
let JwtStrategy = JwtStrategy_1 = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(configService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get("JWT_SECRET") || "gwan-secret-key-production-2024",
        });
        this.configService = configService;
        this.logger = new common_1.Logger(JwtStrategy_1.name);
        this.logger.log("[JWT] Estratégia JWT inicializada");
    }
    async validate(payload) {
        this.logger.debug("[JWT] Validando payload do token:", payload);
        if (!payload.sub || !payload.email) {
            this.logger.warn("[JWT] Payload inválido - campos obrigatórios ausentes");
            throw new Error("Token inválido");
        }
        const user = {
            id: payload.sub,
            email: payload.email,
            name: payload.name,
        };
        this.logger.debug(`[JWT] Usuário validado: ${user.email}`);
        return user;
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = JwtStrategy_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], JwtStrategy);


/***/ }),
/* 35 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 36 */
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),
/* 37 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const jwt_auth_guard_1 = __webpack_require__(38);
Object.defineProperty(exports, "JwtAuthGuard", ({ enumerable: true, get: function () { return jwt_auth_guard_1.JwtAuthGuard; } }));
exports["default"] = jwt_auth_guard_1.JwtAuthGuard;


/***/ }),
/* 38 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var JwtAuthGuard_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const common_1 = __webpack_require__(3);
const passport_1 = __webpack_require__(35);
let JwtAuthGuard = JwtAuthGuard_1 = class JwtAuthGuard extends (0, passport_1.AuthGuard)("jwt") {
    constructor() {
        super(...arguments);
        this.logger = new common_1.Logger(JwtAuthGuard_1.name);
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        this.logger.debug(`[Auth] Verificando autenticação para rota: ${request.method} ${request.url}`);
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            this.logger.warn("[Auth] Header de autorização não encontrado");
            return false;
        }
        if (!authHeader.startsWith("Bearer ")) {
            this.logger.warn('[Auth] Formato inválido do header de autorização. Deve começar com "Bearer "');
            return false;
        }
        return super.canActivate(context);
    }
    handleRequest(err, user, info) {
        if (err) {
            this.logger.error("[Auth] Erro na autenticação:", err);
            throw err;
        }
        if (!user) {
            this.logger.warn("[Auth] Usuário não encontrado no token JWT");
            throw new common_1.UnauthorizedException("Usuário não autenticado");
        }
        this.logger.debug(`[Auth] Usuário autenticado com sucesso: ${user.email}`);
        return user;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = JwtAuthGuard_1 = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);


/***/ }),
/* 39 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HealthModule = void 0;
const common_1 = __webpack_require__(3);
const health_controller_1 = __webpack_require__(40);
let HealthModule = class HealthModule {
};
exports.HealthModule = HealthModule;
exports.HealthModule = HealthModule = __decorate([
    (0, common_1.Module)({
        controllers: [health_controller_1.HealthController],
    })
], HealthModule);


/***/ }),
/* 40 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HealthController = void 0;
const common_1 = __webpack_require__(3);
const swagger_1 = __webpack_require__(2);
let HealthController = class HealthController {
    check() {
        return {
            status: "healthy",
            timestamp: new Date().toISOString(),
            service: "gwan-bff-app",
        };
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Health check endpoint" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Service is healthy" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "check", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)("health"),
    (0, common_1.Controller)("health")
], HealthController);


/***/ }),
/* 41 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EmailWorkerModule = void 0;
const common_1 = __webpack_require__(3);
const email_worker_1 = __webpack_require__(42);
let EmailWorkerModule = class EmailWorkerModule {
};
exports.EmailWorkerModule = EmailWorkerModule;
exports.EmailWorkerModule = EmailWorkerModule = __decorate([
    (0, common_1.Module)({
        providers: [email_worker_1.EmailWorker],
    })
], EmailWorkerModule);


/***/ }),
/* 42 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailWorker_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EmailWorker = void 0;
const common_1 = __webpack_require__(3);
const config_1 = __webpack_require__(5);
const amqp = __webpack_require__(26);
const nodemailer = __webpack_require__(43);
let EmailWorker = EmailWorker_1 = class EmailWorker {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(EmailWorker_1.name);
        this.maxRetries = 3;
        this.retryDelay = 5000;
        this.queueName = "email_notifications";
        this.deadLetterExchange = "email_notifications_dlx";
        this.deadLetterQueue = "email_notifications_dlq";
        this.transporter = nodemailer.createTransport({
            host: this.configService.get("SMTP_HOST"),
            port: this.configService.get("SMTP_PORT"),
            secure: false,
            requireTLS: true,
            tls: {
                ciphers: "SSLv3",
                rejectUnauthorized: false,
            },
            auth: {
                user: this.configService.get("SMTP_USER"),
                pass: this.configService.get("SMTP_PASSWORD"),
            },
            pool: true,
            maxConnections: 5,
            maxMessages: 100,
            rateDelta: 1000,
            rateLimit: 5,
        });
        this.logger.log("Email worker initialized with production settings");
    }
    async onModuleInit() {
        await this.connect();
        await this.consume();
    }
    async onModuleDestroy() {
        await this.closeConnection();
    }
    async connect() {
        let retries = 0;
        while (retries < this.maxRetries) {
            try {
                const rabbitmqUri = this.configService.get("RABBITMQ_URI") ||
                    "amqp://root:pazdeDeus2025@rabbitmq.gwan.com.br:5672";
                if (!rabbitmqUri) {
                    throw new Error("RABBITMQ_URI environment variable is not set");
                }
                const conn = await amqp.connect(rabbitmqUri);
                this.connection = conn;
                const ch = await conn.createChannel();
                this.channel = ch;
                await this.channel.assertExchange(this.deadLetterExchange, "direct", {
                    durable: true,
                });
                await this.channel.assertQueue(this.deadLetterQueue, { durable: true });
                await this.channel.bindQueue(this.deadLetterQueue, this.deadLetterExchange, this.queueName);
                try {
                    const queueInfo = await this.channel.checkQueue(this.queueName);
                    this.logger.log(`[EmailWorker] Fila existente encontrada: ${JSON.stringify(queueInfo)}`);
                }
                catch (error) {
                    this.logger.log("[EmailWorker] Fila não existe, criando nova fila...");
                    await this.channel.assertQueue(this.queueName, {
                        durable: true,
                        arguments: {
                            "x-message-ttl": 86400000,
                            "x-dead-letter-exchange": this.deadLetterExchange,
                            "x-dead-letter-routing-key": this.queueName,
                        },
                    });
                }
                await this.channel.prefetch(1);
                this.logger.log("[EmailWorker] Conectado ao RabbitMQ com sucesso");
                return;
            }
            catch (error) {
                retries++;
                this.logger.error(`[EmailWorker] Erro ao conectar ao RabbitMQ (tentativa ${retries}/${this.maxRetries}):`, error);
                if (retries < this.maxRetries) {
                    this.logger.log(`[EmailWorker] Tentando reconectar em ${this.retryDelay / 1000} segundos...`);
                    await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
                }
                else {
                    this.logger.error("[EmailWorker] Número máximo de tentativas de conexão atingido");
                    throw error;
                }
            }
        }
    }
    async consume() {
        try {
            if (!this.channel) {
                await this.connect();
            }
            await this.channel.consume(this.queueName, async (msg) => {
                if (msg) {
                    try {
                        const emailData = JSON.parse(msg.content.toString());
                        await this.sendEmail(emailData);
                        this.channel.ack(msg);
                    }
                    catch (error) {
                        this.logger.error("[EmailWorker] Erro ao processar mensagem:", error);
                        this.channel.nack(msg, false, true);
                    }
                }
            });
            this.logger.log("[EmailWorker] Consumidor iniciado com sucesso");
        }
        catch (error) {
            this.logger.error("[EmailWorker] Erro ao iniciar consumidor:", error);
            setTimeout(() => this.consume(), this.retryDelay);
        }
    }
    async sendEmail(emailData) {
        let retries = 0;
        while (retries < this.maxRetries) {
            try {
                const mailOptions = {
                    from: {
                        name: this.configService.get("SMTP_FROM_NAME", "GWAN"),
                        address: this.configService.get("SMTP_FROM_EMAIL", "gwan@gwan.com.br"),
                    },
                    to: emailData.to,
                    subject: emailData.subject,
                    text: emailData.content,
                    html: emailData.content.replace(/\n/g, "<br>"),
                    headers: {
                        "X-Priority": "1",
                        "X-MSMail-Priority": "High",
                        Importance: "high",
                    },
                };
                await this.transporter.sendMail(mailOptions);
                this.logger.log(`[EmailWorker] Email enviado com sucesso - Assunto [${emailData.subject}] para [${emailData.to}] conteudo[${emailData.content}] date[${new Date().toISOString()}]`);
                return;
            }
            catch (error) {
                retries++;
                this.logger.error(`[EmailWorker] Erro ao enviar email (tentativa ${retries}/${this.maxRetries}):`, error);
                if (retries < this.maxRetries) {
                    this.logger.log(`[EmailWorker] Tentando reenviar em ${this.retryDelay / 1000} segundos...`);
                    await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
                }
                else {
                    this.logger.error("[EmailWorker] Número máximo de tentativas de envio atingido");
                    throw error;
                }
            }
        }
    }
    async closeConnection() {
        try {
            if (this.channel) {
                await this.channel.close();
            }
            if (this.connection) {
                const conn = this.connection;
                await conn.close();
            }
            this.logger.log("[EmailWorker] Conexões fechadas com sucesso");
        }
        catch (error) {
            this.logger.error("[EmailWorker] Erro ao fechar conexões:", error);
        }
    }
};
exports.EmailWorker = EmailWorker;
exports.EmailWorker = EmailWorker = EmailWorker_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], EmailWorker);


/***/ }),
/* 43 */
/***/ ((module) => {

module.exports = require("nodemailer");

/***/ }),
/* 44 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DatasetModule = void 0;
const common_1 = __webpack_require__(3);
const platform_express_1 = __webpack_require__(45);
const mongoose_1 = __webpack_require__(6);
const dataset_controller_1 = __webpack_require__(46);
const dataset_service_1 = __webpack_require__(47);
const bucket_file_entity_1 = __webpack_require__(51);
const bucket_file_repository_impl_1 = __webpack_require__(52);
let DatasetModule = class DatasetModule {
};
exports.DatasetModule = DatasetModule;
exports.DatasetModule = DatasetModule = __decorate([
    (0, common_1.Module)({
        imports: [
            platform_express_1.MulterModule.register({
                dest: "./datasets",
            }),
            mongoose_1.MongooseModule.forFeature([
                { name: bucket_file_entity_1.BucketFile.name, schema: bucket_file_entity_1.BucketFileSchema },
            ]),
        ],
        controllers: [dataset_controller_1.DatasetController],
        providers: [
            dataset_service_1.DatasetService,
            bucket_file_repository_impl_1.BucketFileRepositoryImpl,
            {
                provide: "IBucketFileRepository",
                useClass: bucket_file_repository_impl_1.BucketFileRepositoryImpl,
            },
        ],
    })
], DatasetModule);


/***/ }),
/* 45 */
/***/ ((module) => {

module.exports = require("@nestjs/platform-express");

/***/ }),
/* 46 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DatasetController = void 0;
const common_1 = __webpack_require__(3);
const platform_express_1 = __webpack_require__(45);
const dataset_service_1 = __webpack_require__(47);
const multer_1 = __webpack_require__(50);
const jwt_auth_guard_1 = __webpack_require__(38);
let DatasetController = class DatasetController {
    constructor(datasetService) {
        this.datasetService = datasetService;
    }
    async listFiles(req) {
        const userId = req.user.id;
        if (!userId) {
            throw new Error("Usuário não autenticado");
        }
        return this.datasetService.listBucketContents(userId);
    }
    async uploadFile(file, req) {
        if (!file) {
            throw new Error("Nenhum arquivo foi enviado");
        }
        const userId = req.user.id;
        if (!userId) {
            throw new Error("Usuário não autenticado");
        }
        return this.datasetService.handleFileUpload(file, userId);
    }
    async uploadFileToKnowledgeBase(file, knowledgeBaseId, req) {
        if (!file) {
            throw new Error("Nenhum arquivo foi enviado");
        }
        const userId = req.user.id;
        if (!userId) {
            throw new Error("Usuário não autenticado");
        }
        return this.datasetService.handleFileUpload(file, userId, knowledgeBaseId);
    }
};
exports.DatasetController = DatasetController;
__decorate([
    (0, common_1.Get)("list"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DatasetController.prototype, "listFiles", null);
__decorate([
    (0, common_1.Post)("upload"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        storage: (0, multer_1.memoryStorage)(),
        fileFilter: (req, file, callback) => {
            if (file.mimetype !== "application/pdf") {
                return callback(new Error("Apenas arquivos PDF são permitidos!"), false);
            }
            callback(null, true);
        },
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DatasetController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Post)(":knowledgeBaseId/documents"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        storage: (0, multer_1.memoryStorage)(),
        fileFilter: (req, file, callback) => {
            if (file.mimetype !== "application/pdf") {
                return callback(new Error("Apenas arquivos PDF são permitidos!"), false);
            }
            callback(null, true);
        },
        limits: {
            fileSize: 20 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Param)("knowledgeBaseId")),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], DatasetController.prototype, "uploadFileToKnowledgeBase", null);
exports.DatasetController = DatasetController = __decorate([
    (0, common_1.Controller)("user/dataset"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof dataset_service_1.DatasetService !== "undefined" && dataset_service_1.DatasetService) === "function" ? _a : Object])
], DatasetController);


/***/ }),
/* 47 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var DatasetService_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DatasetService = void 0;
const common_1 = __webpack_require__(3);
const config_1 = __webpack_require__(5);
const Minio = __webpack_require__(48);
const bucket_file_repository_1 = __webpack_require__(49);
let DatasetService = DatasetService_1 = class DatasetService {
    constructor(configService, bucketFileRepository) {
        this.configService = configService;
        this.bucketFileRepository = bucketFileRepository;
        this.logger = new common_1.Logger(DatasetService_1.name);
        this.bucketName = "datasets";
        const minioConfig = {
            endPoint: this.configService.get("MINIO_ENDPOINT"),
            port: Number(this.configService.get("MINIO_PORT")),
            useSSL: this.configService.get("MINIO_USE_SSL") === "true",
            accessKey: this.configService.get("MINIO_ACCESS_KEY"),
            secretKey: this.configService.get("MINIO_SECRET_KEY"),
        };
        this.logger.log("Initializing MinIO client with config:", {
            endPoint: minioConfig.endPoint,
            port: minioConfig.port,
            useSSL: minioConfig.useSSL,
            accessKey: minioConfig.accessKey,
            secretKey: minioConfig.secretKey,
        });
        this.minioClient = new Minio.Client(minioConfig);
    }
    async listBucketContents(userId) {
        try {
            const exists = await this.minioClient.bucketExists(this.bucketName);
            if (!exists) {
                throw new common_1.InternalServerErrorException(`Bucket ${this.bucketName} não encontrado. Por favor, crie o bucket no console do MinIO.`);
            }
            this.logger.debug("Listando conteúdo do bucket...");
            const bucketFiles = await this.bucketFileRepository.findByUserId(userId);
            const objects = [];
            const userPrefix = `${userId}/`;
            const stream = this.minioClient.listObjects(this.bucketName, userPrefix, true);
            return new Promise((resolve, reject) => {
                stream.on("data", (obj) => {
                    const bucketFile = bucketFiles.find((bf) => bf.fileName === obj.name);
                    if (bucketFile) {
                        objects.push({
                            id: bucketFile.id,
                            name: obj.name,
                            size: obj.size,
                            lastModified: obj.lastModified,
                            etag: obj.etag,
                            originalName: bucketFile.originalName,
                            mimeType: bucketFile.mimeType,
                            url: bucketFile.url,
                        });
                    }
                });
                stream.on("end", () => {
                    this.logger.debug(`Encontrados ${objects.length} objetos no bucket para o usuário ${userId}`);
                    resolve(objects);
                });
                stream.on("error", (err) => {
                    this.logger.error("Erro ao listar conteúdo do bucket:", {
                        error: err,
                        message: err.message,
                        code: err.code,
                        statusCode: err.statusCode,
                    });
                    reject(new common_1.InternalServerErrorException("Falha ao listar conteúdo do bucket"));
                });
            });
        }
        catch (error) {
            this.logger.error("Erro inesperado ao listar conteúdo do bucket:", {
                error: error,
                message: error.message,
                code: error.code,
                statusCode: error.statusCode,
            });
            throw new common_1.InternalServerErrorException(error.message ||
                "Ocorreu um erro inesperado ao listar o conteúdo do bucket");
        }
    }
    async handleFileUpload(file, userId, knowledgeBaseId) {
        try {
            const exists = await this.minioClient.bucketExists(this.bucketName);
            if (!exists) {
                throw new common_1.InternalServerErrorException(`Bucket ${this.bucketName} não encontrado. Por favor, crie o bucket no console do MinIO.`);
            }
            const objectName = knowledgeBaseId
                ? `${userId}/${knowledgeBaseId}/${Date.now()}-${file.originalname}`
                : `${userId}/${Date.now()}-${file.originalname}`;
            const fileBuffer = file.buffer;
            if (!fileBuffer) {
                throw new common_1.InternalServerErrorException("Arquivo inválido ou corrompido");
            }
            this.logger.debug("Fazendo upload do arquivo...", {
                filename: file.originalname,
                size: file.size,
                mimetype: file.mimetype,
                objectName: objectName,
                knowledgeBaseId: knowledgeBaseId,
            });
            await this.minioClient.putObject(this.bucketName, objectName, fileBuffer, file.size, { "Content-Type": file.mimetype });
            this.logger.debug("Upload do arquivo concluído com sucesso");
            const url = await this.minioClient.presignedGetObject(this.bucketName, objectName, 24 * 60 * 60);
            const bucketFile = await this.bucketFileRepository.create({
                userId,
                originalName: file.originalname,
                fileName: objectName,
                size: file.size,
                mimeType: file.mimetype,
                url,
                bucketName: this.bucketName,
                knowledgeBaseId: knowledgeBaseId,
            });
            return {
                id: bucketFile.id,
                originalname: file.originalname,
                filename: objectName,
                size: file.size,
                mimetype: file.mimetype,
                url: url,
                knowledgeBaseId: knowledgeBaseId,
            };
        }
        catch (error) {
            this.logger.error("Erro ao fazer upload do arquivo:", {
                error: error,
                message: error.message,
                code: error.code,
                statusCode: error.statusCode,
                filename: file?.originalname,
            });
            throw new common_1.InternalServerErrorException(error.message || "Falha ao fazer upload do arquivo");
        }
    }
};
exports.DatasetService = DatasetService;
exports.DatasetService = DatasetService = DatasetService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)("IBucketFileRepository")),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object, typeof (_b = typeof bucket_file_repository_1.IBucketFileRepository !== "undefined" && bucket_file_repository_1.IBucketFileRepository) === "function" ? _b : Object])
], DatasetService);


/***/ }),
/* 48 */
/***/ ((module) => {

module.exports = require("minio");

/***/ }),
/* 49 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 50 */
/***/ ((module) => {

module.exports = require("multer");

/***/ }),
/* 51 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BucketFileSchema = exports.BucketFile = void 0;
const mongoose_1 = __webpack_require__(6);
const base_entity_1 = __webpack_require__(33);
let BucketFile = class BucketFile extends base_entity_1.BaseEntity {
};
exports.BucketFile = BucketFile;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BucketFile.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BucketFile.prototype, "originalName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BucketFile.prototype, "fileName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], BucketFile.prototype, "size", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BucketFile.prototype, "mimeType", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BucketFile.prototype, "url", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BucketFile.prototype, "bucketName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BucketFile.prototype, "knowledgeBaseId", void 0);
exports.BucketFile = BucketFile = __decorate([
    (0, mongoose_1.Schema)()
], BucketFile);
exports.BucketFileSchema = mongoose_1.SchemaFactory.createForClass(BucketFile);


/***/ }),
/* 52 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BucketFileRepositoryImpl = void 0;
const common_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(6);
const mongoose_2 = __webpack_require__(31);
let BucketFileRepositoryImpl = class BucketFileRepositoryImpl {
    constructor(bucketFileModel) {
        this.bucketFileModel = bucketFileModel;
    }
    async findById(id) {
        return this.bucketFileModel.findById(id).exec();
    }
    async findAll() {
        return this.bucketFileModel.find().exec();
    }
    async create(data) {
        const bucketFile = new this.bucketFileModel(data);
        return bucketFile.save();
    }
    async update(id, data) {
        return this.bucketFileModel
            .findByIdAndUpdate(id, data, { new: true })
            .exec();
    }
    async delete(id) {
        await this.bucketFileModel.findByIdAndDelete(id).exec();
    }
    async findByUserId(userId) {
        return this.bucketFileModel.find({ userId }).exec();
    }
};
exports.BucketFileRepositoryImpl = BucketFileRepositoryImpl;
exports.BucketFileRepositoryImpl = BucketFileRepositoryImpl = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)("BucketFile")),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], BucketFileRepositoryImpl);


/***/ }),
/* 53 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KnowledgeModule = void 0;
const common_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(6);
const knowledge_controller_1 = __webpack_require__(54);
const knowledge_service_1 = __webpack_require__(55);
const knowledge_base_schema_1 = __webpack_require__(56);
const auth_module_1 = __webpack_require__(18);
const dataset_service_1 = __webpack_require__(57);
const bucket_file_entity_1 = __webpack_require__(58);
const rabbitmq_service_1 = __webpack_require__(63);
const dataset_module_1 = __webpack_require__(44);
const rabbitmq_module_1 = __webpack_require__(64);
let KnowledgeModule = class KnowledgeModule {
    constructor(rabbitMQService) {
        this.rabbitMQService = rabbitMQService;
    }
    async onModuleInit() {
        await this.rabbitMQService.init();
    }
    async onModuleDestroy() {
        await this.rabbitMQService.closeConnection();
    }
};
exports.KnowledgeModule = KnowledgeModule;
exports.KnowledgeModule = KnowledgeModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: knowledge_base_schema_1.KnowledgeBase.name, schema: knowledge_base_schema_1.KnowledgeBaseSchema },
                { name: bucket_file_entity_1.BucketFile.name, schema: bucket_file_entity_1.BucketFileSchema },
            ]),
            auth_module_1.AuthModule,
            dataset_module_1.DatasetModule,
            rabbitmq_module_1.RabbitMQModule
        ],
        controllers: [knowledge_controller_1.KnowledgeController],
        providers: [knowledge_service_1.KnowledgeService, dataset_service_1.DatasetService, rabbitmq_service_1.RabbitMQService],
        exports: [knowledge_service_1.KnowledgeService, dataset_service_1.DatasetService],
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof rabbitmq_service_1.RabbitMQService !== "undefined" && rabbitmq_service_1.RabbitMQService) === "function" ? _a : Object])
], KnowledgeModule);


/***/ }),
/* 54 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KnowledgeController = void 0;
const common_1 = __webpack_require__(3);
const knowledge_service_1 = __webpack_require__(55);
const jwt_auth_guard_1 = __webpack_require__(38);
const swagger_1 = __webpack_require__(2);
const create_knowledge_base_dto_1 = __webpack_require__(61);
let KnowledgeController = class KnowledgeController {
    constructor(knowledgeService) {
        this.knowledgeService = knowledgeService;
    }
    async createKnowledgeBase(req, createKnowledgeBaseDto) {
        return this.knowledgeService.createKnowledgeBase(req.user.id, createKnowledgeBaseDto.name, createKnowledgeBaseDto.description);
    }
    async listKnowledgeBases(req) {
        return this.knowledgeService.listUserKnowledgeBases(req.user.id);
    }
    async getKnowledgeBase(req, id) {
        return this.knowledgeService.getKnowledgeBaseById(id, req.user.id);
    }
    async deleteKnowledgeBase(req, id) {
        return this.knowledgeService.deleteKnowledgeBase(id, req.user.id);
    }
    async startProcess(id, req) {
        const userId = req.user.id;
        return this.knowledgeService.startProcess(id, userId);
    }
};
exports.KnowledgeController = KnowledgeController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: "Criar uma nova base de conhecimento",
        description: "Cria uma nova base de conhecimento a partir de um arquivo PDF existente",
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Base de conhecimento criada com sucesso",
        schema: {
            properties: {
                _id: { type: "string", example: "507f1f77bcf86cd799439011" },
                userId: { type: "string", example: "507f1f77bcf86cd799439012" },
                name: { type: "string", example: "Base de Conhecimento de Marketing" },
                description: {
                    type: "string",
                    example: "Base de conhecimento contendo informações sobre estratégias de marketing digital",
                },
                status: {
                    type: "string",
                    example: "processing",
                    enum: ["processing", "completed", "failed"],
                },
                createdAt: { type: "string", format: "date-time" },
                updatedAt: { type: "string", format: "date-time" },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Dados inválidos fornecidos" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Não autorizado" }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_knowledge_base_dto_1.CreateKnowledgeBaseDto !== "undefined" && create_knowledge_base_dto_1.CreateKnowledgeBaseDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], KnowledgeController.prototype, "createKnowledgeBase", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: "Listar bases de conhecimento",
        description: "Retorna todas as bases de conhecimento do usuário atual",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Lista de bases de conhecimento retornada com sucesso",
        schema: {
            type: "array",
            items: {
                properties: {
                    _id: { type: "string", example: "507f1f77bcf86cd799439011" },
                    userId: { type: "string", example: "507f1f77bcf86cd799439012" },
                    fileId: { type: "string", example: "507f1f77bcf86cd799439013" },
                    name: {
                        type: "string",
                        example: "Base de Conhecimento de Marketing",
                    },
                    description: {
                        type: "string",
                        example: "Base de conhecimento contendo informações sobre estratégias de marketing digital",
                    },
                    filename: { type: "string", example: "marketing_strategies.pdf" },
                    status: {
                        type: "string",
                        example: "processing",
                        enum: ["processing", "completed", "failed"],
                    },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Não autorizado" }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], KnowledgeController.prototype, "listKnowledgeBases", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({
        summary: "Obter base de conhecimento específica",
        description: "Retorna uma base de conhecimento específica pelo ID",
    }),
    (0, swagger_1.ApiParam)({ name: "id", description: "ID da base de conhecimento" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Base de conhecimento retornada com sucesso",
        schema: {
            properties: {
                _id: { type: "string", example: "507f1f77bcf86cd799439011" },
                userId: { type: "string", example: "507f1f77bcf86cd799439012" },
                fileId: { type: "string", example: "507f1f77bcf86cd799439013" },
                name: { type: "string", example: "Base de Conhecimento de Marketing" },
                description: {
                    type: "string",
                    example: "Base de conhecimento contendo informações sobre estratégias de marketing digital",
                },
                filename: { type: "string", example: "marketing_strategies.pdf" },
                status: {
                    type: "string",
                    example: "processing",
                    enum: ["processing", "completed", "failed"],
                },
                createdAt: { type: "string", format: "date-time" },
                updatedAt: { type: "string", format: "date-time" },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Não autorizado" }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: "Base de conhecimento não encontrada",
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], KnowledgeController.prototype, "getKnowledgeBase", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, swagger_1.ApiOperation)({
        summary: "Excluir base de conhecimento",
        description: "Exclui uma base de conhecimento específica pelo ID",
    }),
    (0, swagger_1.ApiParam)({ name: "id", description: "ID da base de conhecimento" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Base de conhecimento excluída com sucesso",
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Não autorizado" }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: "Base de conhecimento não encontrada",
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], KnowledgeController.prototype, "deleteKnowledgeBase", null);
__decorate([
    (0, common_1.Post)(":id/start-process"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], KnowledgeController.prototype, "startProcess", null);
exports.KnowledgeController = KnowledgeController = __decorate([
    (0, swagger_1.ApiTags)("knowledge"),
    (0, common_1.Controller)("user/knowledge"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [typeof (_a = typeof knowledge_service_1.KnowledgeService !== "undefined" && knowledge_service_1.KnowledgeService) === "function" ? _a : Object])
], KnowledgeController);


/***/ }),
/* 55 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var KnowledgeService_1;
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KnowledgeService = void 0;
const common_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(6);
const mongoose_2 = __webpack_require__(31);
const knowledge_base_schema_1 = __webpack_require__(56);
const dataset_service_1 = __webpack_require__(57);
const rabbitmq_service_1 = __webpack_require__(59);
let KnowledgeService = KnowledgeService_1 = class KnowledgeService {
    constructor(knowledgeBaseModel, datasetService, rabbitMQService) {
        this.knowledgeBaseModel = knowledgeBaseModel;
        this.datasetService = datasetService;
        this.rabbitMQService = rabbitMQService;
        this.logger = new common_1.Logger(KnowledgeService_1.name);
    }
    async createKnowledgeBase(userId, name, description) {
        const createDto = {
            userId,
            name,
            description,
            status: "new",
        };
        console.log("createDto", createDto);
        const createdKnowledgeBase = new this.knowledgeBaseModel(createDto);
        const savedKnowledgeBase = await createdKnowledgeBase.save();
        const message = {
            knowledgeBaseId: savedKnowledgeBase._id,
            userId: savedKnowledgeBase.userId,
        };
        console.log("message", message);
        await this.rabbitMQService.sendMessage(message);
        return savedKnowledgeBase;
    }
    async listUserKnowledgeBases(userId) {
        return this.knowledgeBaseModel.find({ userId }).exec();
    }
    async getKnowledgeBaseById(id, userId) {
        const knowledgeBase = await this.knowledgeBaseModel
            .findOne({ _id: id, userId })
            .exec();
        if (!knowledgeBase) {
            throw new common_1.NotFoundException(`Knowledge base with ID ${id} not found`);
        }
        return knowledgeBase;
    }
    async update(id, updateKnowledgeBaseDto) {
        const updatedKnowledgeBase = await this.knowledgeBaseModel
            .findByIdAndUpdate(id, updateKnowledgeBaseDto, { new: true })
            .exec();
        if (!updatedKnowledgeBase) {
            throw new common_1.NotFoundException(`Knowledge base with ID ${id} not found`);
        }
        return updatedKnowledgeBase;
    }
    async deleteKnowledgeBase(id, userId) {
        const result = await this.knowledgeBaseModel
            .deleteOne({ _id: id, userId })
            .exec();
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException(`Knowledge base with ID ${id} not found`);
        }
    }
    async startProcess(id, userId) {
        const knowledgeBase = await this.getKnowledgeBaseById(id, userId);
        if (knowledgeBase.status === "processing") {
            throw new common_1.BadRequestException("A base de conhecimento já está em processamento");
        }
        knowledgeBase.status = "processing";
        await knowledgeBase.save();
        await this.rabbitMQService.sendMessage({
            knowledgeBaseId: id,
            userId: userId,
        });
        this.logger.log(`Iniciado processamento da base de conhecimento ${id} para o usuário ${userId}`);
        return knowledgeBase;
    }
};
exports.KnowledgeService = KnowledgeService;
exports.KnowledgeService = KnowledgeService = KnowledgeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(knowledge_base_schema_1.KnowledgeBase.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof dataset_service_1.DatasetService !== "undefined" && dataset_service_1.DatasetService) === "function" ? _b : Object, typeof (_c = typeof rabbitmq_service_1.RabbitMQService !== "undefined" && rabbitmq_service_1.RabbitMQService) === "function" ? _c : Object])
], KnowledgeService);


/***/ }),
/* 56 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KnowledgeBaseSchema = exports.KnowledgeBase = void 0;
const mongoose_1 = __webpack_require__(6);
const mongoose_2 = __webpack_require__(31);
let KnowledgeBase = class KnowledgeBase extends mongoose_2.Document {
};
exports.KnowledgeBase = KnowledgeBase;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], KnowledgeBase.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], KnowledgeBase.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], KnowledgeBase.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: "new" }),
    __metadata("design:type", String)
], KnowledgeBase.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], KnowledgeBase.prototype, "error", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], KnowledgeBase.prototype, "metadata", void 0);
exports.KnowledgeBase = KnowledgeBase = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], KnowledgeBase);
exports.KnowledgeBaseSchema = mongoose_1.SchemaFactory.createForClass(KnowledgeBase);


/***/ }),
/* 57 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var DatasetService_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DatasetService = void 0;
const common_1 = __webpack_require__(3);
const config_1 = __webpack_require__(5);
const Minio = __webpack_require__(48);
const bucket_file_entity_1 = __webpack_require__(58);
const mongoose_1 = __webpack_require__(6);
const mongoose_2 = __webpack_require__(31);
let DatasetService = DatasetService_1 = class DatasetService {
    constructor(configService, bucketFileModel) {
        this.configService = configService;
        this.bucketFileModel = bucketFileModel;
        this.logger = new common_1.Logger(DatasetService_1.name);
        this.bucketName =
            this.configService.get("MINIO_BUCKET_NAME") || "datasets";
        this.minioClient = new Minio.Client({
            endPoint: this.configService.get("MINIO_ENDPOINT") || "localhost",
            port: parseInt(this.configService.get("MINIO_PORT") || "9000"),
            useSSL: this.configService.get("MINIO_USE_SSL") === "true",
            accessKey: this.configService.get("MINIO_ACCESS_KEY") || "minioadmin",
            secretKey: this.configService.get("MINIO_SECRET_KEY") || "minioadmin",
        });
    }
    async handleFileUpload(file, userId) {
        try {
            const objectName = `${userId}/${Date.now()}-${file.originalname}`;
            await this.minioClient.putObject(this.bucketName, objectName, file.buffer, file.size, { "Content-Type": file.mimetype });
            const url = await this.minioClient.presignedGetObject(this.bucketName, objectName, 24 * 60 * 60);
            const bucketFile = new this.bucketFileModel({
                userId,
                originalName: file.originalname,
                fileName: objectName,
                size: file.size,
                mimeType: file.mimetype,
                url,
                bucketName: this.bucketName,
            });
            await bucketFile.save();
            return bucketFile;
        }
        catch (error) {
            this.logger.error(`Erro ao fazer upload do arquivo: ${error.message}`, error.stack);
            throw error;
        }
    }
    async listBucketContents(userId) {
        try {
            const files = await this.bucketFileModel.find({ userId }).exec();
            for (const file of files) {
                try {
                    const url = await this.minioClient.presignedGetObject(this.bucketName, file.fileName, 24 * 60 * 60);
                    file.url = url;
                }
                catch (error) {
                    this.logger.warn(`Erro ao gerar URL para arquivo ${file.fileName}: ${error.message}`);
                }
            }
            return files;
        }
        catch (error) {
            this.logger.error(`Erro ao listar arquivos: ${error.message}`, error.stack);
            throw error;
        }
    }
    async deleteFile(fileId, userId) {
        try {
            const file = await this.bucketFileModel.findOne({ _id: fileId, userId });
            if (!file) {
                throw new Error("Arquivo não encontrado");
            }
            await this.minioClient.removeObject(this.bucketName, file.fileName);
            await this.bucketFileModel.deleteOne({ _id: fileId });
        }
        catch (error) {
            this.logger.error(`Erro ao deletar arquivo: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getFileUrl(fileId, userId) {
        try {
            const file = await this.bucketFileModel.findOne({ _id: fileId, userId });
            if (!file) {
                throw new Error("Arquivo não encontrado");
            }
            return await this.minioClient.presignedGetObject(this.bucketName, file.fileName, 24 * 60 * 60);
        }
        catch (error) {
            this.logger.error(`Erro ao gerar URL do arquivo: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.DatasetService = DatasetService;
exports.DatasetService = DatasetService = DatasetService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(bucket_file_entity_1.BucketFile.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object])
], DatasetService);


/***/ }),
/* 58 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BucketFileSchema = exports.BucketFile = void 0;
const mongoose_1 = __webpack_require__(6);
const mongoose_2 = __webpack_require__(31);
let BucketFile = class BucketFile extends mongoose_2.Document {
};
exports.BucketFile = BucketFile;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BucketFile.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BucketFile.prototype, "originalName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BucketFile.prototype, "fileName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], BucketFile.prototype, "size", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BucketFile.prototype, "mimeType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BucketFile.prototype, "url", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BucketFile.prototype, "bucketName", void 0);
exports.BucketFile = BucketFile = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], BucketFile);
exports.BucketFileSchema = mongoose_1.SchemaFactory.createForClass(BucketFile);


/***/ }),
/* 59 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RabbitMQService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RabbitMQService = void 0;
const common_1 = __webpack_require__(3);
const config_1 = __webpack_require__(5);
const amqp = __webpack_require__(60);
let RabbitMQService = RabbitMQService_1 = class RabbitMQService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(RabbitMQService_1.name);
        const url = this.configService.get("RABBITMQ_URL");
        if (!url) {
            throw new Error("RABBITMQ_URL not configured");
        }
        this.connection = amqp.connect([url]);
        this.connection.on("connect", () => {
            this.logger.log("Conectado ao RabbitMQ");
        });
        this.connection.on("disconnect", (err) => {
            this.logger.error("Desconectado do RabbitMQ", err);
        });
        this.channelWrapper = this.connection.createChannel({
            setup: (channel) => {
                return Promise.all([
                    channel.assertExchange("knowledge.exchange", "topic", {
                        durable: true,
                    }),
                ]);
            },
        });
    }
    async onModuleInit() {
        try {
            await this.channelWrapper.waitForConnect();
            this.logger.log("Canal RabbitMQ inicializado com sucesso");
        }
        catch (error) {
            this.logger.error("Erro ao inicializar canal RabbitMQ:", error);
            throw error;
        }
    }
    async onModuleDestroy() {
        try {
            await this.channelWrapper.close();
            await this.connection.close();
            this.logger.log("Conexão com RabbitMQ fechada com sucesso");
        }
        catch (error) {
            this.logger.error("Erro ao fechar conexão com RabbitMQ:", error);
        }
    }
    async sendMessage(message) {
        try {
            const exchange = "knowledge.exchange";
            const routingKey = "knowledge.process";
            await this.channelWrapper.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)), {
                persistent: true,
            });
            this.logger.debug(`Mensagem publicada com sucesso: ${routingKey}`, message);
        }
        catch (error) {
            this.logger.error("Erro ao publicar mensagem no RabbitMQ:", error);
            throw error;
        }
    }
    async publish(routingKey, message) {
        try {
            const exchange = "knowledge.exchange";
            await this.channelWrapper.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)), {
                persistent: true,
            });
            this.logger.debug(`Mensagem publicada com sucesso: ${routingKey}`, message);
        }
        catch (error) {
            this.logger.error("Erro ao publicar mensagem no RabbitMQ:", error);
            throw error;
        }
    }
    async consume(queue, callback) {
        try {
            await this.channelWrapper.addSetup(async (channel) => {
                await channel.assertQueue(queue, { durable: true });
                await channel.consume(queue, async (msg) => {
                    if (msg) {
                        try {
                            const content = JSON.parse(msg.content.toString());
                            await callback(content);
                            channel.ack(msg);
                        }
                        catch (error) {
                            this.logger.error("Erro ao processar mensagem:", error);
                            channel.nack(msg, false, true);
                        }
                    }
                });
            });
            this.logger.log(`Consumidor iniciado para a fila: ${queue}`);
        }
        catch (error) {
            this.logger.error("Erro ao iniciar consumidor:", error);
            throw error;
        }
    }
};
exports.RabbitMQService = RabbitMQService;
exports.RabbitMQService = RabbitMQService = RabbitMQService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], RabbitMQService);


/***/ }),
/* 60 */
/***/ ((module) => {

module.exports = require("amqp-connection-manager");

/***/ }),
/* 61 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateKnowledgeBaseDto = void 0;
const class_validator_1 = __webpack_require__(62);
const swagger_1 = __webpack_require__(2);
class CreateKnowledgeBaseDto {
}
exports.CreateKnowledgeBaseDto = CreateKnowledgeBaseDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateKnowledgeBaseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Nome da base de conhecimento",
        example: "Base de Conhecimento de Marketing",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateKnowledgeBaseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Descrição da base de conhecimento",
        example: "Base de conhecimento contendo informações sobre estratégias de marketing digital",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateKnowledgeBaseDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(["new", "processing", "completed", "failed"]),
    __metadata("design:type", String)
], CreateKnowledgeBaseDto.prototype, "status", void 0);


/***/ }),
/* 62 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 63 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RabbitMQService = void 0;
const common_1 = __webpack_require__(3);
const amqp = __webpack_require__(26);
let RabbitMQService = class RabbitMQService {
    constructor() {
        this.queueName = "knowledge_base_processing";
    }
    async init() {
        try {
            this.connection = await amqp.connect(process.env.RABBITMQ_URL);
            this.channel = await this.connection.createChannel();
            await this.channel.assertQueue(this.queueName, {
                durable: true,
            });
            console.log("RabbitMQ conectado com sucesso");
        }
        catch (error) {
            console.error("Erro ao conectar com RabbitMQ:", error);
            throw error;
        }
    }
    async sendMessage(message) {
        try {
            await this.channel.sendToQueue(this.queueName, Buffer.from(JSON.stringify(message)), {
                persistent: true,
            });
            console.log("Mensagem enviada com sucesso:", message);
        }
        catch (error) {
            console.error("Erro ao enviar mensagem:", error);
            throw error;
        }
    }
    async closeConnection() {
        try {
            if (this.channel) {
                await this.channel.close();
            }
            if (this.connection) {
                await this.connection.close();
            }
            console.log("Conexão com RabbitMQ fechada com sucesso");
        }
        catch (error) {
            console.error("Erro ao fechar conexão com RabbitMQ:", error);
            throw error;
        }
    }
};
exports.RabbitMQService = RabbitMQService;
exports.RabbitMQService = RabbitMQService = __decorate([
    (0, common_1.Injectable)()
], RabbitMQService);


/***/ }),
/* 64 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RabbitMQModule = void 0;
const common_1 = __webpack_require__(3);
const rabbitmq_service_1 = __webpack_require__(59);
const config_1 = __webpack_require__(5);
let RabbitMQModule = class RabbitMQModule {
};
exports.RabbitMQModule = RabbitMQModule;
exports.RabbitMQModule = RabbitMQModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        providers: [rabbitmq_service_1.RabbitMQService],
        exports: [rabbitmq_service_1.RabbitMQService]
    })
], RabbitMQModule);


/***/ }),
/* 65 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersModule = void 0;
const common_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(6);
const user_schema_1 = __webpack_require__(66);
const profile_service_1 = __webpack_require__(67);
const profile_controller_1 = __webpack_require__(68);
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: user_schema_1.User.name, schema: user_schema_1.UserSchema }]),
        ],
        controllers: [profile_controller_1.ProfileController],
        providers: [profile_service_1.ProfileService],
        exports: [profile_service_1.ProfileService],
    })
], UsersModule);


/***/ }),
/* 66 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserSchema = exports.User = void 0;
const mongoose_1 = __webpack_require__(6);
const mongoose_2 = __webpack_require__(31);
let User = class User extends mongoose_2.Document {
};
exports.User = User;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "whatsapp", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], User.prototype, "updatedAt", void 0);
exports.User = User = __decorate([
    (0, mongoose_1.Schema)()
], User);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);


/***/ }),
/* 67 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfileService = void 0;
const common_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(6);
const mongoose_2 = __webpack_require__(31);
const user_schema_1 = __webpack_require__(66);
let ProfileService = class ProfileService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async getProfile(userId) {
        return this.userModel.findById(userId).select('-password').exec();
    }
    async updateProfile(userId, updateProfileDto) {
        return this.userModel
            .findByIdAndUpdate(userId, {
            $set: {
                name: updateProfileDto.name,
                whatsapp: updateProfileDto.whatsapp,
                updatedAt: new Date(),
            },
        }, { new: true })
            .select('-password')
            .exec();
    }
};
exports.ProfileService = ProfileService;
exports.ProfileService = ProfileService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], ProfileService);


/***/ }),
/* 68 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfileController = void 0;
const common_1 = __webpack_require__(3);
const swagger_1 = __webpack_require__(2);
const jwt_auth_guard_1 = __webpack_require__(38);
const profile_service_1 = __webpack_require__(67);
const update_profile_dto_1 = __webpack_require__(69);
const profile_response_dto_1 = __webpack_require__(70);
let ProfileController = class ProfileController {
    constructor(profileService) {
        this.profileService = profileService;
    }
    async getProfile(req) {
        return this.profileService.getProfile(req.user.id);
    }
    async updateProfile(req, updateProfileDto) {
        return this.profileService.updateProfile(req.user.id, updateProfileDto);
    }
};
exports.ProfileController = ProfileController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Obter perfil do usuário',
        description: 'Retorna as informações do perfil do usuário autenticado.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Perfil do usuário retornado com sucesso',
        type: profile_response_dto_1.ProfileResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Não autorizado - Token JWT ausente ou inválido'
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Usuário não encontrado'
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Patch)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Atualizar perfil do usuário',
        description: 'Atualiza as informações do perfil do usuário autenticado.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Perfil atualizado com sucesso',
        type: profile_response_dto_1.ProfileResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Dados inválidos fornecidos'
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Não autorizado - Token JWT ausente ou inválido'
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Usuário não encontrado'
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof update_profile_dto_1.UpdateProfileDto !== "undefined" && update_profile_dto_1.UpdateProfileDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "updateProfile", null);
exports.ProfileController = ProfileController = __decorate([
    (0, swagger_1.ApiTags)('Perfil do Usuário'),
    (0, common_1.Controller)('user/profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiExtraModels)(profile_response_dto_1.ProfileResponseDto, update_profile_dto_1.UpdateProfileDto),
    __metadata("design:paramtypes", [typeof (_a = typeof profile_service_1.ProfileService !== "undefined" && profile_service_1.ProfileService) === "function" ? _a : Object])
], ProfileController);


/***/ }),
/* 69 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateProfileDto = void 0;
const class_validator_1 = __webpack_require__(62);
const swagger_1 = __webpack_require__(2);
class UpdateProfileDto {
}
exports.UpdateProfileDto = UpdateProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nome do usuário',
        example: 'João da Silva',
        minLength: 3,
        maxLength: 100
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3, { message: 'O nome deve ter no mínimo 3 caracteres' }),
    (0, class_validator_1.MaxLength)(100, { message: 'O nome deve ter no máximo 100 caracteres' }),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Número do WhatsApp do usuário',
        example: '+5511999999999',
        required: false,
        pattern: '\\+?[1-9]\\d{1,14}$'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/\+?[1-9]\d{1,14}$/, {
        message: 'Formato de WhatsApp inválido. Use o formato internacional (ex: +5511999999999)'
    }),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "whatsapp", void 0);


/***/ }),
/* 70 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfileResponseDto = void 0;
const swagger_1 = __webpack_require__(2);
class ProfileResponseDto {
}
exports.ProfileResponseDto = ProfileResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID do usuário' }),
    __metadata("design:type", String)
], ProfileResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nome do usuário' }),
    __metadata("design:type", String)
], ProfileResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email do usuário' }),
    __metadata("design:type", String)
], ProfileResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Número do WhatsApp do usuário', required: false, nullable: true }),
    __metadata("design:type", String)
], ProfileResponseDto.prototype, "whatsapp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Data de criação do usuário' }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], ProfileResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Data da última atualização do usuário' }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], ProfileResponseDto.prototype, "updatedAt", void 0);


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(1);
const swagger_1 = __webpack_require__(2);
const common_1 = __webpack_require__(3);
const app_module_1 = __webpack_require__(4);
const mongoose = __webpack_require__(31);
const common_2 = __webpack_require__(3);
const config_1 = __webpack_require__(5);
async function bootstrap() {
    const logger = new common_2.Logger("Bootstrap");
    try {
        mongoose.connection.on("connected", async () => {
            logger.log("[MongoDB] Conexão estabelecida com sucesso");
            try {
                const db = mongoose.connection.db;
                const result = await db.command({ connectionStatus: 1 });
                logger.log("[MongoDB] Usuário autenticado:", result?.authInfo?.authenticatedUsers?.[0]?.user || "não disponível");
            }
            catch (err) {
                logger.error("[MongoDB] Erro ao obter status da conexão:", err);
            }
        });
        mongoose.connection.on("error", (err) => {
            logger.error("[MongoDB] Erro na conexão:", err);
        });
        mongoose.connection.on("disconnected", () => {
            logger.log("[MongoDB] Desconectado");
        });
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        const configService = app.get(config_1.ConfigService);
        app.setGlobalPrefix('api');
        app.enableCors({
            origin: [
                "http://localhost:5173",
                "http://localhost:5174",
                "https://bff.gwan.com.br",
                "https://www.bff.gwan.com.br",
                "https://admin.gwan.com.br",
                "https://www.admin.gwan.com.br",
            ],
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
            credentials: true,
        });
        const config = new swagger_1.DocumentBuilder()
            .setTitle("GWAN API")
            .setDescription("API do sistema GWAN")
            .setVersion("1.0")
            .addBearerAuth({
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            name: "JWT",
            description: "Enter JWT token",
            in: "header",
        }, "JWT")
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup("api", app, document);
        app.useGlobalPipes(new common_1.ValidationPipe());
        const port = configService.get("PORT") || 3000;
        await app.listen(port);
        logger.log(`Application is running on: http://localhost:${port}`);
    }
    catch (error) {
        logger.error("Erro ao iniciar a aplicação:", error);
        process.exit(1);
    }
}
process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    process.exit(1);
});
bootstrap();

})();

/******/ })()
;