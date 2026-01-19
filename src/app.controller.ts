import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Response } from 'express';
import { AppService } from './app.service';
import { Public } from './modules/auth/decorators/public.decorator';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Endpoint de bienvenida',
    description: 'Retorna una página HTML estilizada de bienvenida. Este es el endpoint raíz de la API UTU Viajes y Gastos. Accede a /api para ver la documentación completa de Swagger.',
  })
  @ApiResponse({
    status: 200,
    description: 'Página HTML estilizada de bienvenida retornada exitosamente',
    content: {
      'text/html': {
        schema: {
          type: 'string',
          example: '<html>...</html>',
        },
      },
    },
  })
  getHello(@Res() res: Response): void {
    res.setHeader('Content-Type', 'text/html');
    res.send(this.appService.getHello());
  }
}
