import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AppService } from "./app.service";

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @ApiOperation({ summary: 'Endpoint raiz da aplicação' })
  @ApiResponse({
    status: 200,
    description: 'Mensagem de boas-vindas da aplicação',
    schema: {
      type: 'string',
      example: 'Hello World!'
    }
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
