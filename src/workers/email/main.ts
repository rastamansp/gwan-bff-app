import { NestFactory } from "@nestjs/core";
import { EmailWorkerModule } from "./email.module";

async function bootstrap() {
  const app = await NestFactory.create(EmailWorkerModule);
  await app.listen(0); // Porta 0 pois não precisamos expor uma API HTTP
  console.log("Email worker iniciado");
}

bootstrap();
