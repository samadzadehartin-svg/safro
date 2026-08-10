import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}
  @Get() list() { return this.orders.findAll(); }
  @Post() create(@Body() body: Record<string, any>) { return this.orders.create(body); }
  @Patch(':id/status') status(@Param('id', ParseIntPipe) id: number, @Body('status') status: string) { return this.orders.setStatus(id, status); }
}
