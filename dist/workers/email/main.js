"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const email_module_1 = require("./email.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(email_module_1.EmailWorkerModule);
    await app.listen(0);
    console.log('Email worker iniciado');
}
bootstrap();
//# sourceMappingURL=main.js.map