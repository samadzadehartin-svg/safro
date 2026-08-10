import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ToursService } from './tours.service';

@Controller('tours')
export class ToursController {
  constructor(private readonly tours: ToursService) {}

  @Get()
  list() { return this.tours.findAll(); }

  @Get(':id')
  one(@Param('id', ParseIntPipe) id: number) { return this.tours.findOne(id); }

  @Post()
  create(@Body() body: Record<string, any>) { return this.tours.create(body); }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: Record<string, any>) { return this.tours.update(id, body); }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return this.tours.remove(id); }
}
