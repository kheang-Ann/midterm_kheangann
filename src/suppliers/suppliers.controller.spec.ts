import { Test, TestingModule } from '@nestjs/testing';
import { SuppliersController } from './suppliers.controller';
import { SuppliersService } from './suppliers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

const mockSupplier: any = {
  id: 1,
  name: 'Tech Supplies Co.',
  email: 'supplier@techsupplies.com',
  phone: '+1-555-0100',
  address: '123 Warehouse St',
  contactPerson: 'Jane Smith',
  isActive: true,
  inventoryItems: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('SuppliersController', () => {
  let controller: SuppliersController;
  let service: jest.Mocked<SuppliersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuppliersController],
      providers: [
        {
          provide: SuppliersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<SuppliersController>(SuppliersController);
    service = module.get(SuppliersService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should call service.create and return the new supplier', async () => {
      service.create.mockResolvedValue(mockSupplier);
      const dto = { name: 'Tech Supplies Co.', email: 'supplier@techsupplies.com' };
      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockSupplier);
    });
  });

  describe('findAll', () => {
    it('should return all suppliers', async () => {
      service.findAll.mockResolvedValue([mockSupplier]);
      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockSupplier]);
    });
  });

  describe('findOne', () => {
    it('should return a supplier by ID', async () => {
      service.findOne.mockResolvedValue(mockSupplier);
      const result = await controller.findOne(1);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockSupplier);
    });
  });

  describe('update', () => {
    it('should update and return the supplier', async () => {
      const updated = { ...mockSupplier, name: 'Updated Supplier' };
      service.update.mockResolvedValue(updated);
      const result = await controller.update(1, { name: 'Updated Supplier' });
      expect(service.update).toHaveBeenCalledWith(1, { name: 'Updated Supplier' });
      expect(result.name).toBe('Updated Supplier');
    });
  });

  describe('remove', () => {
    it('should delete supplier and return success message', async () => {
      service.remove.mockResolvedValue({ message: 'Supplier with ID 1 deleted successfully' });
      const result = await controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result.message).toContain('deleted successfully');
    });
  });
});
