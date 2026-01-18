import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ListasCompraService } from './listas-compra.service';
import { CreateListaCompraDto } from '../../dto/create-lista-compra.dto';

@Controller('listas-compra')
export class ListasCompraController {
  constructor(private readonly listasCompraService: ListasCompraService) {}

  @Post()
  create(@Body() createListaCompraDto: CreateListaCompraDto) {
    return this.listasCompraService.create(createListaCompraDto);
  }

  @Get()
  findAll(@Query('userId') userId?: string) {
    if (userId) {
      return this.listasCompraService.findByUserId(userId);
    }
    return this.listasCompraService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.listasCompraService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateListaCompraDto: Partial<CreateListaCompraDto>,
  ) {
    return this.listasCompraService.update(id, updateListaCompraDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.listasCompraService.remove(id);
  }
}
