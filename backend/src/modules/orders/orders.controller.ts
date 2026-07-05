import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole, OrderStatus, PaymentMethod } from '../../common/enums';
import { User } from '../../database/entities';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles(UserRole.CUSTOMER)
  @Post()
  checkout(
    @CurrentUser() user: User,
    @Body() data: {
      deliveryAddress: string;
      deliveryLat: number;
      deliveryLng: number;
      deliveryInstructions?: string;
      paymentMethod: PaymentMethod;
      tip?: number;
      promotionCode?: string;
    },
  ) {
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
    @Query('status') status?: OrderStatus,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.ordersService.findByStore(storeId, status, page, pageSize);
  }

  @Roles(UserRole.SHOPKEEPER, UserRole.ADMIN)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() data: { status: OrderStatus },
  ) {
    return this.ordersService.updateStatus(id, data.status, user.id);
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
