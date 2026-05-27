import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './entities/supplier.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  async create(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    const existing = await this.supplierRepository.findOne({
      where: { email: createSupplierDto.email },
    });
    if (existing) {
      throw new ConflictException('Supplier with this email already exists');
    }
    const supplier = this.supplierRepository.create(createSupplierDto);
    return this.supplierRepository.save(supplier);
  }

  async findAll(): Promise<Supplier[]> {
    return this.supplierRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Supplier> {
    const supplier = await this.supplierRepository.findOne({
      where: { id },
      relations: { inventoryItems: true },
    });
    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }
    return supplier;
  }

  async update(id: number, updateSupplierDto: UpdateSupplierDto): Promise<Supplier> {
    const supplier = await this.findOne(id);

    if (updateSupplierDto.email && updateSupplierDto.email !== supplier.email) {
      const existing = await this.supplierRepository.findOne({
        where: { email: updateSupplierDto.email },
      });
      if (existing) {
        throw new ConflictException('Supplier with this email already exists');
      }
    }

    Object.assign(supplier, updateSupplierDto);
    return this.supplierRepository.save(supplier);
  }

  async remove(id: number): Promise<{ message: string }> {
    const supplier = await this.findOne(id);
    await this.supplierRepository.remove(supplier);
    return { message: `Supplier with ID ${id} deleted successfully` };
  }
}
