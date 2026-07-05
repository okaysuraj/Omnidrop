import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole } from '../../common/enums';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Get('categories')
  findAllCategories() {
    return this.productsService.findAllCategories();
  }

  @Roles(UserRole.ADMIN)
  @Post('categories')
  createCategory(@Body() data: { name: string; slug: string; imageUrl?: string; sortOrder?: number }) {
    return this.productsService.createCategory(data);
  }

  @Roles(UserRole.ADMIN)
  @Patch('categories/:id')
  updateCategory(@Param('id') id: string, @Body() data: any) {
    return this.productsService.updateCategory(id, data);
  }

  @Roles(UserRole.ADMIN)
  @Delete('categories/:id')
  deleteCategory(@Param('id') id: string) {
    return this.productsService.deleteCategory(id);
  }

  @Public()
  @Get('search')
  search(@Query('q') query: string) {
    return this.productsService.search(query || '');
  }

  @Public()
  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
  ) {
    return this.productsService.findAll({ page, pageSize, categoryId, search, sort });
  }

  @Public()
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() data: any) {
    return this.productsService.create(data);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.productsService.update(id, data);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productsService.delete(id);
  }
}
