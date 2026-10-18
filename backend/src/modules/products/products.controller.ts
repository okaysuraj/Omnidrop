import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums';
import { Category, Product } from '../../database/entities';
import { ProductsService } from './products.service';

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
  createCategory(
    @Body() data: { name: string; slug: string; imageUrl?: string; sortOrder?: number },
  ) {
    return this.productsService.createCategory(data);
  }

  @Roles(UserRole.ADMIN)
  @Patch('categories/:id')
  updateCategory(@Param('id') id: string, @Body() data: Partial<Category>) {
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

  @Roles(UserRole.ADMIN, UserRole.SHOPKEEPER)
  @Post()
  create(@Body() data: Partial<Product>) {
    return this.productsService.create(data);
  }

  @Roles(UserRole.ADMIN, UserRole.SHOPKEEPER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Product>) {
    return this.productsService.update(id, data);
  }

  @Roles(UserRole.ADMIN, UserRole.SHOPKEEPER)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productsService.delete(id);
  }
}
