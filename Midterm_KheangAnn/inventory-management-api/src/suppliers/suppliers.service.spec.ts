import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { Supplier } from './entities/supplier.entity';

const mockSupplier: Supplier = {
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

describe('SuppliersService', () => {
  let service: SuppliersService;
  let repo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuppliersService,
        {
          provide: getRepositoryToken(Supplier),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SuppliersService>(SuppliersService);
    repo = module.get(getRepositoryToken(Supplier));
  });

  afterEach(() => jest.clearAllMocks());

  // ─── CREATE ─────────────────────────────────────────────────────────────────

  describe('create', () => {
    it('should create and return a new supplier', async () => {
      repo.findOne.mockResolvedValue(null);
      repo.create.mockReturnValue(mockSupplier);
      repo.save.mockResolvedValue(mockSupplier);

      const result = await service.create({
        name: 'Tech Supplies Co.',
        email: 'supplier@techsupplies.com',
      });

      expect(result).toEqual(mockSupplier);
      expect(repo.save).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictException if email already exists', async () => {
      repo.findOne.mockResolvedValue(mockSupplier);

      await expect(
        service.create({ name: 'Duplicate', email: 'supplier@techsupplies.com' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  // ─── FIND ALL ────────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('should return all suppliers', async () => {
      repo.find.mockResolvedValue([mockSupplier]);
      const result = await service.findAll();
      expect(result).toEqual([mockSupplier]);
    });

    it('should return empty array when no suppliers exist', async () => {
      repo.find.mockResolvedValue([]);
      const result = await service.findAll();
      expect(result).toEqual([]);
    });
  });

  // ─── FIND ONE ────────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('should return a supplier by ID', async () => {
      repo.findOne.mockResolvedValue(mockSupplier);
      const result = await service.findOne(1);
      expect(result).toEqual(mockSupplier);
    });

    it('should throw NotFoundException if supplier not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  // ─── UPDATE ──────────────────────────────────────────────────────────────────

  describe('update', () => {
    it('should update and return the supplier', async () => {
      const updated = { ...mockSupplier, name: 'Updated Supplier' };
      repo.findOne.mockResolvedValue(mockSupplier);
      repo.save.mockResolvedValue(updated);

      const result = await service.update(1, { name: 'Updated Supplier' });
      expect(result.name).toBe('Updated Supplier');
    });

    it('should throw NotFoundException if supplier does not exist', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.update(999, { name: 'X' })).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if new email already taken', async () => {
      const anotherSupplier = { ...mockSupplier, id: 2, email: 'other@example.com' };
      repo.findOne
        .mockResolvedValueOnce(mockSupplier)
        .mockResolvedValueOnce(anotherSupplier);

      await expect(
        service.update(1, { email: 'other@example.com' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  // ─── REMOVE ──────────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('should delete a supplier and return success message', async () => {
      repo.findOne.mockResolvedValue(mockSupplier);
      repo.remove.mockResolvedValue(mockSupplier);

      const result = await service.remove(1);
      expect(result.message).toContain('deleted successfully');
    });

    it('should throw NotFoundException if supplier does not exist', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
