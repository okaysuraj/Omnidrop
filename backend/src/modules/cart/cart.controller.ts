import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums';
import { User } from '../../database/entities';
import { CartService } from './cart.service';

@Controller('cart')
@Roles(UserRole.CUSTOMER)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@CurrentUser() user: User) {
    return this.cartService.getCart(user.id);
  }

  @Post('items')
  addItem(
    @CurrentUser() user: User,
    @Body() data: { storeId: string; productId: string; quantity: number },
  ) {
    return this.cartService.addItem(user.id, data.storeId, data.productId, data.quantity);
  }

  @Patch('items/:itemId')
  updateQuantity(
    @CurrentUser() user: User,
    @Param('itemId') itemId: string,
    @Body() data: { quantity: number },
  ) {
    return this.cartService.updateQuantity(user.id, itemId, data.quantity);
  }

  @Delete('items/:itemId')
  removeItem(@CurrentUser() user: User, @Param('itemId') itemId: string) {
    return this.cartService.removeItem(user.id, itemId);
  }

  @Delete()
  clearCart(@CurrentUser() user: User) {
    return this.cartService.clearCart(user.id);
  }
}
