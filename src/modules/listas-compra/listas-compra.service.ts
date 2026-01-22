import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListaCompra } from '../../entities/lista-compra.entity';
import { Producto } from '../../entities/producto.entity';
import { CreateListaCompraDto } from '../../dto/create-lista-compra.dto';
import { CreateProductoDto } from '../../dto/create-producto.dto';

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
      moneda: createListaCompraDto.moneda,
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

  async addProductoToLista(
    listaId: string,
    createProductoDto: CreateProductoDto,
  ): Promise<ListaCompra> {
    // Verificar que la lista existe
    const listaCompra = await this.findOne(listaId);

    // Crear el producto y asociarlo a la lista
    const producto = this.productoRepository.create({
      nombre: createProductoDto.nombre,
      cantidad: createProductoDto.cantidad ?? 1,
      unidad: createProductoDto.unidad ?? 'un',
      precio: createProductoDto.precio ?? 0,
      imagenUrl: createProductoDto.imagenUrl,
      enCarrito: createProductoDto.enCarrito ?? false,
      listaCompraId: listaId,
    });

    await this.productoRepository.save(producto);

    // Retornar la lista actualizada con todos sus productos
    return await this.findOne(listaId);
  }

  async removeProductoFromLista(
    listaId: string,
    productoId: string,
  ): Promise<void> {
    // Verificar que la lista existe
    await this.findOne(listaId);

    // Buscar el producto
    const producto = await this.productoRepository.findOne({
      where: { id: productoId },
    });

    if (!producto) {
      throw new NotFoundException(
        `Producto con ID ${productoId} no encontrado`,
      );
    }

    // Verificar que el producto pertenece a la lista
    if (producto.listaCompraId !== listaId) {
      throw new BadRequestException(
        `El producto ${productoId} no pertenece a la lista ${listaId}`,
      );
    }

    // Eliminar el producto
    await this.productoRepository.remove(producto);
  }
}
