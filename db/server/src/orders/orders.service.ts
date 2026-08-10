import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { StoreService } from '../store.service';

const statuses = new Set(['new', 'contacted', 'confirmed', 'cancelled']);

@Injectable()
export class OrdersService {
  constructor(private readonly store: StoreService) {}

  findAll() {
    return [...this.store.snapshot.orders].sort((a, b) => Number(b.id) - Number(a.id));
  }

  create(input: Record<string, any>) {
    if (!input.fullName || !input.phone || !input.tourId) throw new BadRequestException('fullName, phone and tourId are required');
    const ids = this.store.snapshot.orders.map((item) => Number(item.id) || 0);
    const order = {
      id: Math.max(0, ...ids) + 1,
      status: 'new',
      createdAt: new Date().toISOString(),
      passengers: 1,
      totalPrice: 0,
      ...input,
    };
    this.store.snapshot.orders.push(order);
    this.store.persist();
    return order;
  }

  setStatus(id: number, status: string) {
    if (!statuses.has(status)) throw new BadRequestException('Invalid order status');
    const order = this.store.snapshot.orders.find((item) => Number(item.id) === id);
    if (!order) throw new NotFoundException('Order not found');
    order.status = status;
    this.store.persist();
    return order;
  }
}
