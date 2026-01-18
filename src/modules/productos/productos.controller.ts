import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from '../../dto/create-producto.dto';

@ApiTags('productos')
@ApiBearerAuth('JWT-auth')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiResponse({
    status: 201,
    description: 'Producto creado exitosamente',
  })
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos obtenida exitosamente',
  })
  findAll() {
    return this.productosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID del producto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un producto' })
  @ApiParam({
    name: 'id',
    description: 'UUID del producto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto actualizado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductoDto: Partial<CreateProductoDto>,
  ) {
    return this.productosService.update(id, updateProductoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiParam({
    name: 'id',
    description: 'UUID del producto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: 'Producto eliminado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productosService.remove(id);
  }
}
