import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryItem, ItemStatus } from './entities/inventory-item.entity';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { AdjustStockDto } from './dto/adjust-stock.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryItem)
    private readonly inventoryRepository: Repository<InventoryItem>,
  ) {}

  async create(createDto: CreateInventoryItemDto): Promise<InventoryItem> {
    const existing = await this.inventoryRepository.findOne({
      where: { sku: createDto.sku },
    });
    if (existing) {
      throw new ConflictException(`Item with SKU '${createDto.sku}' already exists`);
    }

    const item = this.inventoryRepository.create(createDto);
    item.status = this.computeStatus(item.quantity ?? 0, item.lowStockThreshold ?? 10);
    return this.inventoryRepository.save(item);
  }

  async findAll(category?: string): Promise<InventoryItem[]> {
    const query = this.inventoryRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.supplier', 'supplier')
      .orderBy('item.createdAt', 'DESC');

    if (category) {
      query.where('item.category = :category', { category });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<InventoryItem> {
    const item = await this.inventoryRepository.findOne({
      where: { id },
      relations: { supplier: true },
    });
    if (!item) {
      throw new NotFoundException(`Inventory item with ID ${id} not found`);
    }
    return item;
  }

  async findBySku(sku: string): Promise<InventoryItem> {
    const item = await this.inventoryRepository.findOne({
      where: { sku },
      relations: { supplier: true },
    });
    if (!item) {
      throw new NotFoundException(`Inventory item with SKU '${sku}' not found`);
    }
    return item;
  }

  async update(id: number, updateDto: UpdateInventoryItemDto): Promise<InventoryItem> {
    const item = await this.findOne(id);

    if (updateDto.sku && updateDto.sku !== item.sku) {
      const existing = await this.inventoryRepository.findOne({
        where: { sku: updateDto.sku },
      });
      if (existing) {
        throw new ConflictException(`Item with SKU '${updateDto.sku}' already exists`);
      }
    }

    Object.assign(item, updateDto);
    item.status = this.computeStatus(item.quantity, item.lowStockThreshold);
    return this.inventoryRepository.save(item);
  }

  async remove(id: number): Promise<{ message: string }> {
    const item = await this.findOne(id);
    await this.inventoryRepository.remove(item);
    return { message: `Inventory item with ID ${id} deleted successfully` };
  }

  async adjustStock(id: number, adjustDto: AdjustStockDto): Promise<InventoryItem> {
    const item = await this.findOne(id);
    const newQuantity = item.quantity + adjustDto.adjustment;

    if (newQuantity < 0) {
      throw new BadRequestException(
        `Cannot reduce stock below 0. Current: ${item.quantity}, Adjustment: ${adjustDto.adjustment}`,
      );
    }

    item.quantity = newQuantity;
    item.status = this.computeStatus(newQuantity, item.lowStockThreshold);
    return this.inventoryRepository.save(item);
  }

  async getLowStockItems(): Promise<InventoryItem[]> {
    return this.inventoryRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.supplier', 'supplier')
      .where('item.quantity <= item.lowStockThreshold')
      .andWhere('item.status != :status', { status: ItemStatus.DISCONTINUED })
      .orderBy('item.quantity', 'ASC')
      .getMany();
  }

  async getAvailability(id: number): Promise<{
    id: number;
    name: string;
    sku: string;
    quantity: number;
    status: ItemStatus;
    isAvailable: boolean;
  }> {
    const item = await this.findOne(id);
    return {
      id: item.id,
      name: item.name,
      sku: item.sku,
      quantity: item.quantity,
      status: item.status,
      isAvailable: item.status === ItemStatus.AVAILABLE || item.status === ItemStatus.LOW_STOCK,
    };
  }

  private computeStatus(quantity: number, threshold: number): ItemStatus {
    if (quantity === 0) return ItemStatus.OUT_OF_STOCK;
    if (quantity <= threshold) return ItemStatus.LOW_STOCK;
    return ItemStatus.AVAILABLE;
  }
}
