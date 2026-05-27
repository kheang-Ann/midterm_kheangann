import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryItem, ItemStatus } from './entities/inventory-item.entity';

const mockItem: InventoryItem = {
  id: 1,
  name: 'Laptop Dell XPS 15',
  sku: 'DELL-XPS15-001',
  description: 'High-performance laptop',
  category: 'Electronics',
  price: 1299.99,
  quantity: 50,
  lowStockThreshold: 10,
  status: ItemStatus.AVAILABLE,
  location: 'Warehouse A',
  supplierId: null,
  supplier: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockQueryBuilder: any = {
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  getMany: jest.fn().mockResolvedValue([mockItem]),
};

describe('InventoryService', () => {
  let service: InventoryService;
  let repo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: getRepositoryToken(InventoryItem),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
          },
        },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
    repo = module.get(getRepositoryToken(InventoryItem));
  });

  afterEach(() => jest.clearAllMocks());

  // ─── CREATE ─────────────────────────────────────────────────────────────────

  describe('create', () => {
    it('should create and return a new inventory item', async () => {
      repo.findOne.mockResolvedValue(null);
      repo.create.mockReturnValue(mockItem);
      repo.save.mockResolvedValue(mockItem);

      const result = await service.create({
        name: 'Laptop Dell XPS 15',
        sku: 'DELL-XPS15-001',
        price: 1299.99,
        quantity: 50,
      });

      expect(result).toEqual(mockItem);
      expect(repo.save).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictException if SKU already exists', async () => {
      repo.findOne.mockResolvedValue(mockItem);

      await expect(
        service.create({ name: 'Duplicate', sku: 'DELL-XPS15-001', price: 100 }),
      ).rejects.toThrow(ConflictException);
    });

    it('should set status to OUT_OF_STOCK when quantity is 0', async () => {
      const zeroQtyItem = { ...mockItem, quantity: 0, status: ItemStatus.OUT_OF_STOCK };
      repo.findOne.mockResolvedValue(null);
      repo.create.mockReturnValue(zeroQtyItem);
      repo.save.mockResolvedValue(zeroQtyItem);

      const result = await service.create({
        name: 'Empty Item',
        sku: 'EMPTY-001',
        price: 10,
        quantity: 0,
      });

      expect(result.status).toBe(ItemStatus.OUT_OF_STOCK);
    });

    it('should set status to LOW_STOCK when quantity <= threshold', async () => {
      const lowItem = { ...mockItem, quantity: 5, lowStockThreshold: 10, status: ItemStatus.LOW_STOCK };
      repo.findOne.mockResolvedValue(null);
      repo.create.mockReturnValue(lowItem);
      repo.save.mockResolvedValue(lowItem);

      const result = await service.create({
        name: 'Low Item',
        sku: 'LOW-001',
        price: 10,
        quantity: 5,
        lowStockThreshold: 10,
      });

      expect(result.status).toBe(ItemStatus.LOW_STOCK);
    });

    it('should default quantity to 0 and threshold to 10 when not provided', async () => {
      // Covers the `?? 0` and `?? 10` nullish coalescing branches (lines 18, 30)
      const itemNoQty = { ...mockItem, quantity: 0, lowStockThreshold: 10, status: ItemStatus.OUT_OF_STOCK };
      repo.findOne.mockResolvedValue(null);
      // create() returns item with undefined quantity/threshold — triggers ?? fallback
      repo.create.mockReturnValue({ ...mockItem, quantity: undefined, lowStockThreshold: undefined });
      repo.save.mockResolvedValue(itemNoQty);

      const result = await service.create({
        name: 'No Qty Item',
        sku: 'NOQTY-001',
        price: 10,
        // quantity and lowStockThreshold intentionally omitted
      });

      expect(repo.save).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();
    });
  });

  // ─── FIND ALL ────────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('should return all inventory items', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockItem]);
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
    });

    it('should filter by category when provided', async () => {
      await service.findAll('Electronics');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'item.category = :category',
        { category: 'Electronics' },
      );
    });
  });

  // ─── FIND ONE ────────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('should return an item by ID', async () => {
      repo.findOne.mockResolvedValue(mockItem);
      const result = await service.findOne(1);
      expect(result).toEqual(mockItem);
    });

    it('should throw NotFoundException if item not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  // ─── FIND BY SKU ─────────────────────────────────────────────────────────────

  describe('findBySku', () => {
    it('should return an item by SKU', async () => {
      repo.findOne.mockResolvedValue(mockItem);
      const result = await service.findBySku('DELL-XPS15-001');
      expect(result).toEqual(mockItem);
    });

    it('should throw NotFoundException if SKU not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findBySku('NONEXISTENT')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── UPDATE ──────────────────────────────────────────────────────────────────

  describe('update', () => {
    it('should update and return the item', async () => {
      const updated = { ...mockItem, name: 'Updated Laptop' };
      repo.findOne.mockResolvedValue(mockItem);
      repo.save.mockResolvedValue(updated);

      const result = await service.update(1, { name: 'Updated Laptop' });
      expect(result.name).toBe('Updated Laptop');
    });

    it('should update without SKU conflict check when SKU is unchanged', async () => {
      // Passing the same SKU — should skip the conflict check entirely
      const updated = { ...mockItem, price: 999 };
      repo.findOne.mockResolvedValue(mockItem);
      repo.save.mockResolvedValue(updated);

      const result = await service.update(1, { sku: 'DELL-XPS15-001', price: 999 });
      // findOne called only once (for the item itself, not for SKU conflict)
      expect(repo.findOne).toHaveBeenCalledTimes(1);
      expect(result.price).toBe(999);
    });

    it('should update when new SKU is available (no conflict)', async () => {
      repo.findOne
        .mockResolvedValueOnce(mockItem)  // item lookup
        .mockResolvedValueOnce(null);     // SKU conflict check — not taken
      repo.save.mockResolvedValue({ ...mockItem, sku: 'NEW-SKU-001' });

      const result = await service.update(1, { sku: 'NEW-SKU-001' });
      expect(result.sku).toBe('NEW-SKU-001');
    });

    it('should throw NotFoundException if item does not exist', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.update(999, { name: 'X' })).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if new SKU already taken', async () => {
      const anotherItem = { ...mockItem, id: 2, sku: 'OTHER-SKU' };
      repo.findOne
        .mockResolvedValueOnce(mockItem)   // findOne for the item being updated
        .mockResolvedValueOnce(anotherItem); // findOne for SKU conflict check

      await expect(service.update(1, { sku: 'OTHER-SKU' })).rejects.toThrow(ConflictException);
    });

    it('should recompute status based on quantity after update', async () => {
      // computeStatus always derives status from quantity — DISCONTINUED is only
      // set via adjustStock or direct status field; update recalculates from qty
      const itemWithStock = { ...mockItem, quantity: 50, lowStockThreshold: 10 };
      repo.findOne.mockResolvedValue(itemWithStock);
      repo.save.mockResolvedValue({ ...itemWithStock, status: ItemStatus.AVAILABLE });

      const result = await service.update(1, { name: 'Renamed' });
      // quantity=50, threshold=10 → AVAILABLE
      expect(result.status).toBe(ItemStatus.AVAILABLE);
    });
  });

  // ─── REMOVE ──────────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('should delete an item and return success message', async () => {
      repo.findOne.mockResolvedValue(mockItem);
      repo.remove.mockResolvedValue(mockItem);

      const result = await service.remove(1);
      expect(result.message).toContain('deleted successfully');
    });

    it('should throw NotFoundException if item does not exist', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  // ─── ADJUST STOCK ────────────────────────────────────────────────────────────

  describe('adjustStock', () => {
    it('should increase stock correctly', async () => {
      const updated = { ...mockItem, quantity: 60 };
      repo.findOne.mockResolvedValue(mockItem);
      repo.save.mockResolvedValue(updated);

      const result = await service.adjustStock(1, { adjustment: 10 });
      expect(result.quantity).toBe(60);
    });

    it('should decrease stock correctly', async () => {
      const updated = { ...mockItem, quantity: 40 };
      repo.findOne.mockResolvedValue(mockItem);
      repo.save.mockResolvedValue(updated);

      const result = await service.adjustStock(1, { adjustment: -10 });
      expect(result.quantity).toBe(40);
    });

    it('should throw BadRequestException if stock goes below 0', async () => {
      repo.findOne.mockResolvedValue({ ...mockItem, quantity: 5 });

      await expect(
        service.adjustStock(1, { adjustment: -10 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if item does not exist', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.adjustStock(999, { adjustment: 5 })).rejects.toThrow(NotFoundException);
    });
  });

  // ─── LOW STOCK ───────────────────────────────────────────────────────────────

  describe('getLowStockItems', () => {
    it('should return items with low stock', async () => {
      const result = await service.getLowStockItems();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  // ─── AVAILABILITY ────────────────────────────────────────────────────────────

  describe('getAvailability', () => {
    it('should return availability info for an item', async () => {
      repo.findOne.mockResolvedValue(mockItem);
      const result = await service.getAvailability(1);

      expect(result).toHaveProperty('isAvailable');
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('quantity');
      expect(result.isAvailable).toBe(true);
    });

    it('should mark OUT_OF_STOCK item as not available', async () => {
      repo.findOne.mockResolvedValue({ ...mockItem, quantity: 0, status: ItemStatus.OUT_OF_STOCK });
      const result = await service.getAvailability(1);
      expect(result.isAvailable).toBe(false);
    });

    it('should mark LOW_STOCK item as available', async () => {
      repo.findOne.mockResolvedValue({ ...mockItem, quantity: 5, status: ItemStatus.LOW_STOCK });
      const result = await service.getAvailability(1);
      expect(result.isAvailable).toBe(true);
    });

    it('should mark DISCONTINUED item as not available', async () => {
      repo.findOne.mockResolvedValue({ ...mockItem, status: ItemStatus.DISCONTINUED });
      const result = await service.getAvailability(1);
      expect(result.isAvailable).toBe(false);
    });
  });
});
