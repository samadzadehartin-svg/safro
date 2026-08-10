import { Injectable } from '@nestjs/common';
import fs from 'node:fs';
import path from 'node:path';

export type JsonStore = {
  tours: any[];
  orders: any[];
  leads: any[];
  discounts: any[];
};

@Injectable()
export class StoreService {
  private readonly file = process.env.SAFRO_DATA_FILE || (process.env.VERCEL ? '/tmp/safro-store.json' : path.join(process.cwd(), 'data', 'store.json'));
  private readonly seedFile = path.join(process.cwd(), 'data', 'seed.json');
  private data: JsonStore;

  constructor() {
    this.data = this.load();
  }

  private load(): JsonStore {
    const candidate = fs.existsSync(this.file) ? this.file : this.seedFile;
    const parsed = JSON.parse(fs.readFileSync(candidate, 'utf8')) as JsonStore;
    return {
      tours: Array.isArray(parsed.tours) ? parsed.tours : [],
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      leads: Array.isArray(parsed.leads) ? parsed.leads : [],
      discounts: Array.isArray(parsed.discounts) ? parsed.discounts : [],
    };
  }

  get snapshot(): JsonStore {
    return this.data;
  }

  persist() {
    fs.mkdirSync(path.dirname(this.file), { recursive: true });
    fs.writeFileSync(this.file, JSON.stringify(this.data, null, 2), 'utf8');
  }
}
