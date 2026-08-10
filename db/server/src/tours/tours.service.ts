import { Injectable, NotFoundException } from '@nestjs/common';
import { StoreService } from '../store.service';

@Injectable()
export class ToursService {
  constructor(private readonly store: StoreService) {}

  findAll() {
    return this.store.snapshot.tours;
  }

  findOne(id: number) {
    const tour = this.store.snapshot.tours.find((item) => Number(item.id) === id);
    if (!tour) throw new NotFoundException('Tour not found');
    return tour;
  }

  create(input: Record<string, any>) {
    const ids = this.store.snapshot.tours.map((item) => Number(item.id) || 0);
    const tour = {
      id: Math.max(0, ...ids) + 1,
      status: 'active',
      type: 'international',
      rating: 4.5,
      gallery: [],
      dates: [],
      hotels: [],
      ...input,
    };
    this.store.snapshot.tours.unshift(tour);
    this.store.persist();
    return tour;
  }

  update(id: number, input: Record<string, any>) {
    const index = this.store.snapshot.tours.findIndex((item) => Number(item.id) === id);
    if (index < 0) throw new NotFoundException('Tour not found');
    this.store.snapshot.tours[index] = { ...this.store.snapshot.tours[index], ...input, id };
    this.store.persist();
    return this.store.snapshot.tours[index];
  }

  remove(id: number) {
    const index = this.store.snapshot.tours.findIndex((item) => Number(item.id) === id);
    if (index < 0) throw new NotFoundException('Tour not found');
    this.store.snapshot.tours.splice(index, 1);
    this.store.persist();
    return { ok: true as const };
  }
}
