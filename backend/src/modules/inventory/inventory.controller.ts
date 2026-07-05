import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole } from '../../common/enums';

@Controller('stores/:storeId/inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Public()
  @Get()
  findByStore(
    @Param('storeId') storeId: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.inventoryService.findVisibleByStore(storeId, categoryId);
  }

  @Roles(UserRole.SHOPKEEPER)
  @Get('manage')
  findAllForManagement(
    @Param('storeId') storeId: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.inventoryService.findByStore(storeId, page, pageSize);
  }

  @Roles(UserRole.SHOPKEEPER)
  @Post()
  upsert(
    @Param('storeId') storeId: string,
    @Body() data: { productId: string; stock: number; priceOverride?: number; isVisible?: boolean },
  ) {
    return this.inventoryService.upsert(storeId, data.productId, data);
  }

  @Roles(UserRole.SHOPKEEPER)
  @Post('bulk')
  bulkUpsert(
    @Param('storeId') storeId: string,
    @Body() data: { items: Array<{ productId: string; stock: number; priceOverride?: number; isVisible?: boolean }> },
  ) {
    return this.inventoryService.bulkUpsert(storeId, data.items);
  }

  @Roles(UserRole.SHOPKEEPER)
  @Patch(':productId/stock')
  updateStock(
    @Param('storeId') storeId: string,
    @Param('productId') productId: string,
    @Body() data: { stock: number },
  ) {
    return this.inventoryService.updateStock(storeId, productId, data.stock);
  }

  @Roles(UserRole.SHOPKEEPER)
  @Patch(':productId/visibility')
  toggleVisibility(
    @Param('storeId') storeId: string,
    @Param('productId') productId: string,
  ) {
    return this.inventoryService.toggleVisibility(storeId, productId);
  }
}
