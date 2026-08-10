import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { StoreModule } from './store.module';
import { ToursModule } from './tours/tours.module';
import { OrdersModule } from './orders/orders.module';
import { DashboardModule } from './dashboard/dashboard.module';
@Module({ imports: [StoreModule, ToursModule, OrdersModule, DashboardModule], controllers: [AppController] })
export class AppModule {}
