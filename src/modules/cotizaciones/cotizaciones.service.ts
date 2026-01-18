import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cotizacion } from '../../entities/cotizacion.entity';
import { CreateCotizacionDto } from '../../dto/create-cotizacion.dto';

@Injectable()
export class CotizacionesService {
  constructor(
    @InjectRepository(Cotizacion)
    private readonly cotizacionRepository: Repository<Cotizacion>,
  ) {}

  async create(createCotizacionDto: CreateCotizacionDto): Promise<Cotizacion> {
    const cotizacion = this.cotizacionRepository.create(createCotizacionDto);
    return await this.cotizacionRepository.save(cotizacion);
  }

  async findAll(): Promise<Cotizacion[]> {
    return await this.cotizacionRepository.find({
      order: { fechaActualizacion: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Cotizacion> {
    const cotizacion = await this.cotizacionRepository.findOne({
      where: { id },
    });
    if (!cotizacion) {
      throw new NotFoundException(`Cotización con ID ${id} no encontrada`);
    }
    return cotizacion;
  }

  async findByMoneda(moneda: string): Promise<Cotizacion | null> {
    return await this.cotizacionRepository.findOne({
      where: { moneda },
      order: { fechaActualizacion: 'DESC' },
    });
  }

  async update(
    id: string,
    updateCotizacionDto: Partial<CreateCotizacionDto>,
  ): Promise<Cotizacion> {
    const cotizacion = await this.findOne(id);
    Object.assign(cotizacion, updateCotizacionDto);
    return await this.cotizacionRepository.save(cotizacion);
  }

  async remove(id: string): Promise<void> {
    const cotizacion = await this.findOne(id);
    await this.cotizacionRepository.remove(cotizacion);
  }
}
