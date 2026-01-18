import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListaCompra } from '../../entities/lista-compra.entity';
import { Producto } from '../../entities/producto.entity';
import { CreateListaCompraDto } from '../../dto/create-lista-compra.dto';

@Injectable()
export class ListasCompraService {
  constructor(
    @InjectRepository(ListaCompra)
    private readonly listaCompraRepository: Repository<ListaCompra>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async create(createListaCompraDto: CreateListaCompraDto): Promise<ListaCompra> {
    const listaCompra = this.listaCompraRepository.create({
      nombre: createListaCompraDto.nombre,
      userId: createListaCompraDto.userId,
    });

    const savedListaCompra = await this.listaCompraRepository.save(listaCompra);

    if (createListaCompraDto.productos && createListaCompraDto.productos.length > 0) {
      const productos = createListaCompraDto.productos.map((productoDto) =>
        this.productoRepository.create({
          ...productoDto,
          listaCompraId: savedListaCompra.id,
        }),
      );
      await this.productoRepository.save(productos);
    }

    return await this.findOne(savedListaCompra.id);
  }

  async findAll(): Promise<ListaCompra[]> {
    return await this.listaCompraRepository.find({
      relations: ['productos', 'user'],
    });
  }

  async findOne(id: string): Promise<ListaCompra> {
    const listaCompra = await this.listaCompraRepository.findOne({
      where: { id },
      relations: ['productos', 'user'],
    });
    if (!listaCompra) {
      throw new NotFoundException(`Lista de compra con ID ${id} no encontrada`);
    }
    return listaCompra;
  }

  async findByUserId(userId: string): Promise<ListaCompra[]> {
    return await this.listaCompraRepository.find({
      where: { userId },
      relations: ['productos'],
    });
  }

  async update(
    id: string,
    updateListaCompraDto: Partial<CreateListaCompraDto>,
  ): Promise<ListaCompra> {
    const listaCompra = await this.findOne(id);
    Object.assign(listaCompra, updateListaCompraDto);
    return await this.listaCompraRepository.save(listaCompra);
  }

  async remove(id: string): Promise<void> {
    const listaCompra = await this.findOne(id);
    await this.listaCompraRepository.remove(listaCompra);
  }
}
