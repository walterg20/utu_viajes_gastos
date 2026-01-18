import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('cotizaciones')
export class Cotizacion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 10 })
  moneda: string;

  @Column({ type: 'varchar', length: 50 })
  casa: string;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  compra: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  venta: number;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
