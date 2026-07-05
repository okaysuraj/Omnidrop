import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole } from '../../common/enums';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Public()
  @Get('active')
  findActive() { return this.promotionsService.findActive(); }

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
  create(@Body() data: any) { return this.promotionsService.create(data); }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) { return this.promotionsService.update(id, data); }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  delete(@Param('id') id: string) { return this.promotionsService.delete(id); }
}
