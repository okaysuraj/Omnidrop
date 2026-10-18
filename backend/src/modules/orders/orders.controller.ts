import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { OrderStatus, UserRole } from '../../common/enums';
import { User } from '../../database/entities';
import type { CheckoutInput } from './checkout.service';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles(UserRole.CUSTOMER)
  @Post()
  checkout(@CurrentUser() user: User, @Body() data: CheckoutInput) {
    return this.ordersService.checkout(user.id, data);
  }

  @Get('my')
  findMyOrders(
    @CurrentUser() user: User,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.ordersService.findByUser(user.id, page, pageSize);
  }

  @Get('stats')
  @Roles(UserRole.ADMIN)
  getStats() {
    return this.ordersService.getStats();
  }

  @Get(':id')
  findById(@Param('id') id: string, @CurrentUser() user: User) {
    if (user.role === UserRole.ADMIN) {
      return this.ordersService.findById(id);
    }
    return this.ordersService.findById(id, user.id);
  }

  @Roles(UserRole.SHOPKEEPER, UserRole.ADMIN)
  @Get('store/:storeId')
  findByStore(
    @Param('storeId') storeId: string,
    @CurrentUser() user: User,
    @Query('status') status?: OrderStatus,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.ordersService.findByStore(storeId, user, status, page, pageSize);
  }

  @Roles(UserRole.SHOPKEEPER, UserRole.DELIVERY_PARTNER, UserRole.ADMIN)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() data: { status: OrderStatus },
  ) {
    return this.ordersService.updateStatus(id, data.status, user.id, user);
  }

  @Roles(UserRole.CUSTOMER)
  @Post(':id/cancel')
  cancelOrder(@Param('id') id: string, @CurrentUser() user: User) {
    return this.ordersService.cancelOrder(id, user.id);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('status') status?: OrderStatus,
  ) {
    return this.ordersService.findAll(page, pageSize, status);
  }
}
