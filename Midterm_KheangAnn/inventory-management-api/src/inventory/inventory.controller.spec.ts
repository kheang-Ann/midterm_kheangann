import { Test, TestingModule } from '@nestjs/testing';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ItemStatus } from './entities/inventory-item.entity';

const mockItem: any = {
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

const mockAvailability = {
  id: 1,
  name: 'Laptop Dell XPS 15',
  sku: 'DELL-XPS15-001',
  quantity: 50,
  status: ItemStatus.AVAILABLE,
  isAvailable: true,
};

describe('InventoryController', () => {
  let controller: InventoryController;
  let service: jest.Mocked<InventoryService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryController],
      providers: [
        {
          provide: InventoryService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            findBySku: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            adjustStock: jest.fn(),
            getLowStockItems: jest.fn(),
            getAvailability: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<InventoryController>(InventoryController);
    service = module.get(InventoryService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should call service.create and return the new item', async () => {
      service.create.mockResolvedValue(mockItem);
      const dto = { name: 'Laptop', sku: 'DELL-001', price: 1299.99 };
      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockItem);
    });
  });

  describe('findAll', () => {
    it('should return all items without category filter', async () => {
      service.findAll.mockResolvedValue([mockItem]);
      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalledWith(undefined);
      expect(result).toEqual([mockItem]);
    });

    it('should pass category filter to service', async () => {
      service.findAll.mockResolvedValue([mockItem]);
      const result = await controller.findAll('Electronics');
      expect(service.findAll).toHaveBeenCalledWith('Electronics');
      expect(result).toEqual([mockItem]);
    });
  });

  describe('getLowStock', () => {
    it('should return low stock items', async () => {
      service.getLowStockItems.mockResolvedValue([mockItem]);
      const result = await controller.getLowStock();
      expect(service.getLowStockItems).toHaveBeenCalled();
      expect(result).toEqual([mockItem]);
    });
  });

  describe('findBySku', () => {
    it('should return item by SKU', async () => {
      service.findBySku.mockResolvedValue(mockItem);
      const result = await controller.findBySku('DELL-XPS15-001');
      expect(service.findBySku).toHaveBeenCalledWith('DELL-XPS15-001');
      expect(result).toEqual(mockItem);
    });
  });

  describe('findOne', () => {
    it('should return item by ID', async () => {
      service.findOne.mockResolvedValue(mockItem);
      const result = await controller.findOne(1);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockItem);
    });
  });

  describe('getAvailability', () => {
    it('should return availability info', async () => {
      service.getAvailability.mockResolvedValue(mockAvailability);
      const result = await controller.getAvailability(1);
      expect(service.getAvailability).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockAvailability);
    });
  });

  describe('update', () => {
    it('should update and return the item', async () => {
      const updated = { ...mockItem, name: 'Updated Laptop' };
      service.update.mockResolvedValue(updated);
      const result = await controller.update(1, { name: 'Updated Laptop' });
      expect(service.update).toHaveBeenCalledWith(1, { name: 'Updated Laptop' });
      expect(result.name).toBe('Updated Laptop');
    });
  });

  describe('adjustStock', () => {
    it('should adjust stock and return updated item', async () => {
      const updated = { ...mockItem, quantity: 60 };
      service.adjustStock.mockResolvedValue(updated);
      const result = await controller.adjustStock(1, { adjustment: 10 });
      expect(service.adjustStock).toHaveBeenCalledWith(1, { adjustment: 10 });
      expect(result.quantity).toBe(60);
    });
  });

  describe('remove', () => {
    it('should delete item and return success message', async () => {
      service.remove.mockResolvedValue({ message: 'Inventory item with ID 1 deleted successfully' });
      const result = await controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result.message).toContain('deleted successfully');
    });
  });
});
