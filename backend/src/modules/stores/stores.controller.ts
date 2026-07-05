import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto, UpdateStoreDto, NearbyStoresQueryDto } from './dto/store.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole } from '../../common/enums';
import { User } from '../../database/entities';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Roles(UserRole.SHOPKEEPER)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@CurrentUser() user: User, @Body() dto: CreateStoreDto) {
    return this.storesService.create(user.id, dto);
  }

  @Public()
  @Get('nearby')
  findNearby(@Query() query: NearbyStoresQueryDto) {
    return this.storesService.findNearby(query);
  }

  @Public()
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.storesService.findById(id);
  }

  @Roles(UserRole.SHOPKEEPER)
  @Get('my/stores')
  findMyStores(@CurrentUser() user: User) {
    return this.storesService.findByOwner(user.id);
  }

  @Roles(UserRole.SHOPKEEPER)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() dto: UpdateStoreDto,
  ) {
    return this.storesService.update(id, user.id, dto);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id/verify')
  verify(@Param('id') id: string) {
    return this.storesService.verifyStore(id);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  findAll(@Query('page') page: number = 1, @Query('pageSize') pageSize: number = 20) {
    return this.storesService.findAll(page, pageSize);
  }
}
