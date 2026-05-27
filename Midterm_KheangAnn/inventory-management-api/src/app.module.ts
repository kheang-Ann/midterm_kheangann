import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { InventoryModule } from './inventory/inventory.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './auth/entities/user.entity';
import { InventoryItem } from './inventory/entities/inventory-item.entity';
import { Supplier } from './suppliers/entities/supplier.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: process.env.NODE_ENV === 'test' ? ':memory:' : 'inventory.db',
      entities: [User, InventoryItem, Supplier],
      synchronize: true,
      dropSchema: process.env.NODE_ENV === 'test',
    }),
    AuthModule,
    InventoryModule,
    SuppliersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
