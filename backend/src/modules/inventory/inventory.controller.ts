import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums';
import { User } from '../../database/entities';
import { InventoryService } from './inventory.service';

@Controller('stores/:storeId/inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Public()
  @Get()
  findByStore(@Param('storeId') storeId: string, @Query('categoryId') categoryId?: string) {
    return this.inventoryService.findVisibleByStore(storeId, categoryId);
  }

  @Roles(UserRole.SHOPKEEPER, UserRole.ADMIN)
  @Get('manage')
  findAllForManagement(
    @Param('storeId') storeId: string,
    @CurrentUser() user: User,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.inventoryService.findByStore(storeId, user, page, pageSize);
  }

  @Roles(UserRole.SHOPKEEPER, UserRole.ADMIN)
  @Post()
  upsert(
    @Param('storeId') storeId: string,
    @CurrentUser() user: User,
    @Body() data: { productId: string; stock: number; priceOverride?: number; isVisible?: boolean },
  ) {
    return this.inventoryService.upsert(storeId, data.productId, data, user);
  }

  @Roles(UserRole.SHOPKEEPER, UserRole.ADMIN)
  @Post('bulk')
  bulkUpsert(
    @Param('storeId') storeId: string,
    @CurrentUser() user: User,
    @Body()
    data: {
      items: Array<{
        productId: string;
        stock: number;
        priceOverride?: number;
        isVisible?: boolean;
      }>;
    },
  ) {
    return this.inventoryService.bulkUpsert(storeId, data.items, user);
  }

  @Roles(UserRole.SHOPKEEPER, UserRole.ADMIN)
  @Patch(':productId/stock')
  updateStock(
    @Param('storeId') storeId: string,
    @Param('productId') productId: string,
    @CurrentUser() user: User,
    @Body() data: { stock: number },
  ) {
    return this.inventoryService.updateStock(storeId, productId, data.stock, user);
  }

  @Roles(UserRole.SHOPKEEPER, UserRole.ADMIN)
  @Patch(':productId/visibility')
  toggleVisibility(
    @Param('storeId') storeId: string,
    @Param('productId') productId: string,
    @CurrentUser() user: User,
  ) {
    return this.inventoryService.toggleVisibility(storeId, productId, user);
  }
}
