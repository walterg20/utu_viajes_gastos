import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { CotizacionesService } from './cotizaciones.service';
import { CreateCotizacionDto } from '../../dto/create-cotizacion.dto';

@Controller('cotizaciones')
export class CotizacionesController {
  constructor(private readonly cotizacionesService: CotizacionesService) {}

  @Post()
  create(@Body() createCotizacionDto: CreateCotizacionDto) {
    return this.cotizacionesService.create(createCotizacionDto);
  }

  @Get()
  findAll(@Query('moneda') moneda?: string) {
    if (moneda) {
      return this.cotizacionesService.findByMoneda(moneda);
    }
    return this.cotizacionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.cotizacionesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCotizacionDto: Partial<CreateCotizacionDto>,
  ) {
    return this.cotizacionesService.update(id, updateCotizacionDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.cotizacionesService.remove(id);
  }
}
