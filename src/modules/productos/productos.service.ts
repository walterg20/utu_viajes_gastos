import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from '../../entities/producto.entity';
import { CreateProductoDto } from '../../dto/create-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    const producto = this.productoRepository.create(createProductoDto);
    return await this.productoRepository.save(producto);
  }

  async findAll(): Promise<Producto[]> {
    return await this.productoRepository.find();
  }

  async findOne(id: string): Promise<Producto> {
    const producto = await this.productoRepository.findOne({ where: { id } });
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return producto;
  }

  async update(
    id: string,
    updateProductoDto: Partial<CreateProductoDto>,
  ): Promise<Producto> {
    const producto = await this.findOne(id);
    Object.assign(producto, updateProductoDto);
    return await this.productoRepository.save(producto);
  }

  async remove(id: string): Promise<void> {
    const producto = await this.findOne(id);
    await this.productoRepository.remove(producto);
  }
}
