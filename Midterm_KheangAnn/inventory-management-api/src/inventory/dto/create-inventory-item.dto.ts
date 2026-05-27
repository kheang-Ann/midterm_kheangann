import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  Min,
  IsPositive,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ItemStatus } from '../entities/inventory-item.entity';

export class CreateInventoryItemDto {
  @ApiProperty({ example: 'Laptop Dell XPS 15' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'DELL-XPS15-001' })
  @IsString()
  sku: string;

  @ApiPropertyOptional({ example: 'High-performance laptop for professionals' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Electronics' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ example: 1299.99 })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiPropertyOptional({ example: 50, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  lowStockThreshold?: number;

  @ApiPropertyOptional({ enum: ItemStatus, default: ItemStatus.AVAILABLE })
  @IsOptional()
  @IsEnum(ItemStatus)
  status?: ItemStatus;

  @ApiPropertyOptional({ example: 'Warehouse A, Shelf 3' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  supplierId?: number;
}
