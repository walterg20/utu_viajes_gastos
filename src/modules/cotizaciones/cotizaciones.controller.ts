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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CotizacionesService } from './cotizaciones.service';
import { CreateCotizacionDto } from '../../dto/create-cotizacion.dto';

@ApiTags('cotizaciones')
@ApiBearerAuth('JWT-auth')
@Controller('cotizaciones')
export class CotizacionesController {
  constructor(private readonly cotizacionesService: CotizacionesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva cotización' })
  @ApiResponse({
    status: 201,
    description: 'Cotización creada exitosamente',
  })
  create(@Body() createCotizacionDto: CreateCotizacionDto) {
    return this.cotizacionesService.create(createCotizacionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las cotizaciones' })
  @ApiQuery({
    name: 'moneda',
    required: false,
    description: 'Filtrar cotizaciones por código de moneda',
    example: 'USD',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de cotizaciones obtenida exitosamente',
  })
  findAll(@Query('moneda') moneda?: string) {
    if (moneda) {
      return this.cotizacionesService.findByMoneda(moneda);
    }
    return this.cotizacionesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una cotización por ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID de la cotización',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Cotización encontrada',
  })
  @ApiResponse({
    status: 404,
    description: 'Cotización no encontrada',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.cotizacionesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una cotización' })
  @ApiParam({
    name: 'id',
    description: 'UUID de la cotización',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Cotización actualizada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Cotización no encontrada',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCotizacionDto: Partial<CreateCotizacionDto>,
  ) {
    return this.cotizacionesService.update(id, updateCotizacionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una cotización' })
  @ApiParam({
    name: 'id',
    description: 'UUID de la cotización',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: 'Cotización eliminada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Cotización no encontrada',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.cotizacionesService.remove(id);
  }
}
