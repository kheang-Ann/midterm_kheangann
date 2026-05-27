import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Inventory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new inventory item' })
  @ApiResponse({ status: 201, description: 'Item created successfully' })
  @ApiResponse({ status: 409, description: 'SKU already exists' })
  create(@Body() createDto: CreateInventoryItemDto) {
    return this.inventoryService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all inventory items' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category' })
  @ApiResponse({ status: 200, description: 'List of inventory items' })
  findAll(@Query('category') category?: string) {
    return this.inventoryService.findAll(category);
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Get items with low stock levels' })
  @ApiResponse({ status: 200, description: 'List of low stock items' })
  getLowStock() {
    return this.inventoryService.getLowStockItems();
  }

  @Get('sku/:sku')
  @ApiOperation({ summary: 'Get an inventory item by SKU' })
  @ApiParam({ name: 'sku', type: String })
  @ApiResponse({ status: 200, description: 'Item found' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  findBySku(@Param('sku') sku: string) {
    return this.inventoryService.findBySku(sku);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an inventory item by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Item found' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.findOne(id);
  }

  @Get(':id/availability')
  @ApiOperation({ summary: 'Check real-time availability of an item' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Availability status' })
  getAvailability(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.getAvailability(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an inventory item' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Item updated successfully' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateInventoryItemDto,
  ) {
    return this.inventoryService.update(id, updateDto);
  }

  @Patch(':id/stock')
  @ApiOperation({ summary: 'Adjust stock level for an item' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Stock adjusted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid stock adjustment' })
  adjustStock(
    @Param('id', ParseIntPipe) id: number,
    @Body() adjustDto: AdjustStockDto,
  ) {
    return this.inventoryService.adjustStock(id, adjustDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an inventory item' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Item deleted successfully' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.remove(id);
  }
}
