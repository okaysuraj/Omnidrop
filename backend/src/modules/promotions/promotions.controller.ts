import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums';
import { Promotion } from '../../database/entities';
import { PromotionsService } from './promotions.service';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Public()
  @Get('active')
  findActive() {
    return this.promotionsService.findActive();
  }

  @Post('validate')
  validate(@Body() data: { code: string; orderTotal: number }) {
    return this.promotionsService.validate(data.code, data.orderTotal);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  findAll(@Query('page') page?: number, @Query('pageSize') pageSize?: number) {
    return this.promotionsService.findAll(page, pageSize);
  }

  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() data: Partial<Promotion>) {
    return this.promotionsService.create(data);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Promotion>) {
    return this.promotionsService.update(id, data);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.promotionsService.delete(id);
  }
}
