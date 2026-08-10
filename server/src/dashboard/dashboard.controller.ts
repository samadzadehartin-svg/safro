import { Controller, Get } from '@nestjs/common';
import { StoreService } from '../store.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly store: StoreService) {}

  @Get('summary')
  summary() {
    const { tours, orders } = this.store.snapshot;
    return {
      tours: tours.length,
      activeTours: tours.filter((tour) => tour.status === 'active').length,
      orders: orders.length,
      newOrders: orders.filter((order) => order.status === 'new').length,
      revenue: orders.filter((order) => order.status !== 'cancelled').reduce((sum, order) => sum + Number(order.totalPrice || 0), 0),
    };
  }
}
