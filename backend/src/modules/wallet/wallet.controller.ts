import { Body, Controller, ForbiddenException, Get, Logger, Post } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../database/entities';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  private readonly logger = new Logger(WalletController.name);

  constructor(private readonly walletService: WalletService) {}

  @Get()
  getWallet(@CurrentUser() user: User) {
    return this.walletService.getWallet(user.id);
  }

  @Post('topup')
  topup(
    @CurrentUser() user: User,
    @Body() body: { amount: number; referenceId?: string; description?: string },
  ) {
    if (process.env.NODE_ENV === 'production') {
      throw new ForbiddenException(
        'Direct unverified wallet top-up is disabled in production mode. Initiate a verified top-up session via /api/payments/wallet-intent.',
      );
    }
    this.logger.warn(
      `[DEV-SANDBOX] Direct top-up initiated by user ${user.id} for ₹${body.amount}`,
    );
    return this.walletService.topup(
      user.id,
      Number(body.amount),
      body.referenceId,
      body.description,
    );
  }
}
