import { IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCotizacionDto {
  @ApiProperty({
    description: 'Código de la moneda',
    example: 'USD',
  })
  @IsString()
  moneda: string;

  @ApiProperty({
    description: 'Casa de cotización',
    example: 'oficial',
  })
  @IsString()
  casa: string;

  @ApiProperty({
    description: 'Nombre completo de la moneda',
    example: 'Dólar Estadounidense',
  })
  @IsString()
  nombre: string;

  @ApiProperty({
    description: 'Precio de compra',
    example: 950.5,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  compra: number;

  @ApiProperty({
    description: 'Precio de venta',
    example: 980.75,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  venta: number;
}
