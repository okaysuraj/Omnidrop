import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole, DeliveryStatus } from '../../common/enums';
import { User } from '../../database/entities';

@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Roles(UserRole.DELIVERY_PARTNER)
  @Get('available')
  findAvailable(
    @CurrentUser() user: User,
    @Query('lat') lat: number,
    @Query('lng') lng: number,
  ) {
    return this.deliveryService.findAvailableTasks(lat || user.currentLat, lng || user.currentLng);
  }

  @Roles(UserRole.DELIVERY_PARTNER)
  @Get('my-tasks')
  findMyTasks(@CurrentUser() user: User, @Query('status') status?: DeliveryStatus) {
    return this.deliveryService.findMyTasks(user.id, status);
  }

  @Roles(UserRole.DELIVERY_PARTNER)
  @Get('active')
  findActiveTask(@CurrentUser() user: User) {
    return this.deliveryService.findActiveTask(user.id);
  }

  @Roles(UserRole.DELIVERY_PARTNER)
  @Post('tasks/:id/accept')
  acceptTask(@Param('id') id: string, @CurrentUser() user: User) {
    return this.deliveryService.acceptTask(id, user.id);
  }

  @Roles(UserRole.DELIVERY_PARTNER)
  @Patch('tasks/:id/location')
  updateLocation(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() data: { lat: number; lng: number },
  ) {
    return this.deliveryService.updateLocation(id, user.id, data.lat, data.lng);
  }

  @Roles(UserRole.DELIVERY_PARTNER)
  @Patch('tasks/:id/status')
  updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() data: { status: DeliveryStatus },
  ) {
    return this.deliveryService.updateStatus(id, user.id, data.status);
  }

  @Roles(UserRole.DELIVERY_PARTNER)
  @Post('toggle-availability')
  toggleAvailability(@CurrentUser() user: User) {
    return this.deliveryService.toggleAvailability(user.id);
  }

  @Roles(UserRole.DELIVERY_PARTNER)
  @Get('earnings')
  getEarnings(@CurrentUser() user: User) {
    return this.deliveryService.getEarnings(user.id);
  }

  @Roles(UserRole.ADMIN)
  @Post('tasks/:id/assign')
  assignRider(
    @Param('id') id: string,
    @Body() data: { riderId: string },
  ) {
    return this.deliveryService.assignRider(id, data.riderId);
  }
}
