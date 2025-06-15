import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { getPackageInfo } from '../../utils/version.util';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Verificar saúde da aplicação' })
  @ApiResponse({ status: 200, description: 'Aplicação funcionando normalmente' })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    };
  }

  @Get('version')
  @ApiOperation({ summary: 'Obter informações de versão da aplicação' })
  @ApiResponse({ status: 200, description: 'Informações de versão retornadas com sucesso' })
  getVersion() {
    const packageInfo = getPackageInfo();
    return {
      name: packageInfo.name,
      version: packageInfo.version,
      description: packageInfo.description,
      buildInfo: packageInfo.buildInfo,
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    };
  }
}
