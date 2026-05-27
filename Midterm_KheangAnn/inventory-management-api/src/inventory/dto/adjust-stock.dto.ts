import { IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AdjustStockDto {
  @ApiProperty({ example: 10, description: 'Positive to add stock, negative to remove' })
  @IsNumber()
  adjustment: number;

  @ApiPropertyOptional({ example: 'Received new shipment' })
  @IsOptional()
  @IsString()
  reason?: string;
}
