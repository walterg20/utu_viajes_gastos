import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ListaCompra } from './lista-compra.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 1 })
  cantidad: number;

  @Column({ type: 'varchar', length: 50, default: 'un' })
  unidad: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  precio: number;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'imagen_url' })
  imagenUrl: string;

  @Column({ type: 'boolean', default: false, name: 'en_carrito' })
  enCarrito: boolean;

  @Column({ type: 'uuid', nullable: true, name: 'lista_compra_id' })
  listaCompraId: string | null;

  @ManyToOne(() => ListaCompra, (listaCompra) => listaCompra.productos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'lista_compra_id' })
  listaCompra: ListaCompra | null;
}
