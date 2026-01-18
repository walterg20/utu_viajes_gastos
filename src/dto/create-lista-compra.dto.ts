import { IsString, IsUUID, IsOptional, IsArray } from 'class-validator';
import { CreateProductoDto } from './create-producto.dto';

export class CreateListaCompraDto {
  @IsString()
  nombre: string;

  @IsUUID()
  userId: string;

  @IsOptional()
  @IsArray()
  productos?: CreateProductoDto[];
}
