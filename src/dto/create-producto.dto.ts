import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductoDto {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Arroz',
  })
  @IsString()
  nombre: string;

  @ApiPropertyOptional({
    description: 'Cantidad del producto',
    example: 1,
    minimum: 0,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  cantidad?: number;

  @ApiPropertyOptional({
    description: 'Unidad de medida del producto',
    example: 'kg',
    default: 'un',
  })
  @IsOptional()
  @IsString()
  unidad?: string;

  @ApiPropertyOptional({
    description: 'Precio del producto',
    example: 150.5,
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  precio?: number;

  @ApiPropertyOptional({
    description: 'URL de la imagen del producto',
    example: 'https://ejemplo.com/imagen.jpg',
  })
  @IsOptional()
  @IsString()
  imagenUrl?: string;

  @ApiPropertyOptional({
    description: 'Indica si el producto está en el carrito',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  enCarrito?: boolean;

  @ApiPropertyOptional({
    description: 'ID de la lista de compra a la que pertenece',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsString()
  listaCompraId?: string;
}
