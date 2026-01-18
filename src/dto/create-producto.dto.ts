import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
} from 'class-validator';

export class CreateProductoDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cantidad?: number;

  @IsOptional()
  @IsString()
  unidad?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  precio?: number;

  @IsOptional()
  @IsString()
  imagenUrl?: string;

  @IsOptional()
  @IsBoolean()
  enCarrito?: boolean;

  @IsOptional()
  @IsString()
  listaCompraId?: string;
}
