import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums';
import { User } from '../../database/entities';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // --- Addresses ---
  @Get('addresses')
  findAddresses(@CurrentUser() user: User) {
    return this.usersService.findAddresses(user.id);
  }

  @Post('addresses')
  createAddress(@CurrentUser() user: User, @Body() data: any) {
    return this.usersService.createAddress(user.id, data);
  }

  @Patch('addresses/:id')
  updateAddress(@CurrentUser() user: User, @Param('id') id: string, @Body() data: any) {
    return this.usersService.updateAddress(user.id, id, data);
  }

  @Delete('addresses/:id')
  deleteAddress(@CurrentUser() user: User, @Param('id') id: string) {
    return this.usersService.deleteAddress(user.id, id);
  }

  // --- Admin: User Management ---
  @Roles(UserRole.ADMIN)
  @Get('stats')
  getStats() { return this.usersService.getStats(); }

  @Roles(UserRole.ADMIN)
  @Get()
  findAll(@Query('page') page?: number, @Query('pageSize') pageSize?: number, @Query('role') role?: UserRole) {
    return this.usersService.findAll(page, pageSize, role);
  }

  @Roles(UserRole.ADMIN)
  @Get(':id')
  findById(@Param('id') id: string) { return this.usersService.findById(id); }

  @Roles(UserRole.ADMIN)
  @Patch(':id/role')
  updateRole(@Param('id') id: string, @Body() data: { role: UserRole }) {
    return this.usersService.updateRole(id, data.role);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id/toggle-active')
  toggleActive(@Param('id') id: string) { return this.usersService.toggleActive(id); }
}
