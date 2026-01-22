import { IsString, IsUUID, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateProductoDto } from './create-producto.dto';

export class CreateListaCompraDto {
  @ApiProperty({
    description: 'Nombre de la lista de compra',
    example: 'Supermercado',
  })
  @IsString()
  nombre: string;

  @ApiPropertyOptional({
    description: 'Moneda de la lista de compra',
    example: 'USD',
  })
  @IsOptional()
  @IsString()
  moneda?: string;

  @ApiProperty({
    description: 'ID del usuario propietario de la lista',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  userId: string;

  @ApiPropertyOptional({
    description: 'Lista de productos asociados',
    type: [CreateProductoDto],
  })
  @IsOptional()
  @IsArray()
  productos?: CreateProductoDto[];
}
