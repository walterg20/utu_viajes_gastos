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
import { ListasCompraService } from './listas-compra.service';
import { CreateListaCompraDto } from '../../dto/create-lista-compra.dto';

@ApiTags('listas-compra')
@ApiBearerAuth('JWT-auth')
@Controller('listas-compra')
export class ListasCompraController {
  constructor(private readonly listasCompraService: ListasCompraService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva lista de compra' })
  @ApiResponse({
    status: 201,
    description: 'Lista de compra creada exitosamente',
  })
  create(@Body() createListaCompraDto: CreateListaCompraDto) {
    return this.listasCompraService.create(createListaCompraDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las listas de compra' })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Filtrar listas por ID de usuario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de compras obtenida exitosamente',
  })
  findAll(@Query('userId') userId?: string) {
    if (userId) {
      return this.listasCompraService.findByUserId(userId);
    }
    return this.listasCompraService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una lista de compra por ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID de la lista de compra',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de compra encontrada',
  })
  @ApiResponse({
    status: 404,
    description: 'Lista de compra no encontrada',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.listasCompraService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una lista de compra' })
  @ApiParam({
    name: 'id',
    description: 'UUID de la lista de compra',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de compra actualizada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Lista de compra no encontrada',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateListaCompraDto: Partial<CreateListaCompraDto>,
  ) {
    return this.listasCompraService.update(id, updateListaCompraDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una lista de compra' })
  @ApiParam({
    name: 'id',
    description: 'UUID de la lista de compra',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: 'Lista de compra eliminada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Lista de compra no encontrada',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.listasCompraService.remove(id);
  }
}
