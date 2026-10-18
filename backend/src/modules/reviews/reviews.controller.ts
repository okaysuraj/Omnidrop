import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums';
import { User } from '../../database/entities';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Roles(UserRole.CUSTOMER)
  @Post()
  create(
    @CurrentUser() user: User,
    @Body() data: { orderId: string; storeRating?: number; riderRating?: number; comment?: string },
  ) {
    return this.reviewsService.create(user.id, data);
  }

  @Public()
  @Get('store/:storeId')
  findByStore(
    @Param('storeId') storeId: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.reviewsService.findByStore(storeId, page, pageSize);
  }
}
