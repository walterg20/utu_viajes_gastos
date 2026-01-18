import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './modules/auth/decorators/public.decorator';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Endpoint de bienvenida' })
  @ApiResponse({
    status: 200,
    description: 'Mensaje de bienvenida',
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
