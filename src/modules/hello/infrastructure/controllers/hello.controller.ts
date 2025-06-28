import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { GetHelloUseCase } from "../../domain/use-cases/get-hello.use-case";

@ApiTags('Hello')
@Controller("hello")
export class HelloController {
  constructor(private readonly getHelloUseCase: GetHelloUseCase) { }

  @Get()
  @ApiOperation({ summary: 'Mensagem de boas-vindas' })
  @ApiResponse({
    status: 200,
    description: 'Mensagem de boas-vindas retornada com sucesso',
    schema: {
      type: 'string',
      example: 'Hello World!'
    }
  })
  async getHello(): Promise<string> {
    return this.getHelloUseCase.execute();
  }
}
