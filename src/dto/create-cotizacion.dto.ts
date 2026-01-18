import { IsString, IsNumber, Min } from 'class-validator';

export class CreateCotizacionDto {
  @IsString()
  moneda: string;

  @IsString()
  casa: string;

  @IsString()
  nombre: string;

  @IsNumber()
  @Min(0)
  compra: number;

  @IsNumber()
  @Min(0)
  venta: number;
}
