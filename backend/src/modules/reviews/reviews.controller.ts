import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole } from '../../common/enums';
import { User } from '../../database/entities';

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
