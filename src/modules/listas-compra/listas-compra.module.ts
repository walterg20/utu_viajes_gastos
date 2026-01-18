import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListasCompraController } from './listas-compra.controller';
import { ListasCompraService } from './listas-compra.service';
import { ListaCompra } from '../../entities/lista-compra.entity';
import { Producto } from '../../entities/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ListaCompra, Producto])],
  controllers: [ListasCompraController],
  providers: [ListasCompraService],
  exports: [ListasCompraService],
})
export class ListasCompraModule {}
