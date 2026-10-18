import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { WalletTransactionType } from '../../common/enums';
import { Wallet, WalletTransaction } from '../../database/entities';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    private dataSource: DataSource,
  ) {}

  async getWallet(userId: string) {
    let wallet = await this.walletRepository.findOne({
      where: { userId },
      relations: { transactions: true },
    });

    if (!wallet) {
      wallet = this.walletRepository.create({
        userId,
        balance: 0,
        currency: 'INR',
      });
      wallet = await this.walletRepository.save(wallet);
      wallet.transactions = [];
    } else {
      // Sort transactions descending
      wallet.transactions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    return {
      id: wallet.id,
      userId: wallet.userId,
      balance: parseFloat(Number(wallet.balance).toFixed(2)),
      currency: wallet.currency,
      transactions: wallet.transactions || [],
      updatedAt: wallet.updatedAt,
    };
  }

  async topup(userId: string, amount: number, referenceId?: string, description?: string) {
    if (!amount || amount <= 0) {
      throw new BadRequestException('Topup amount must be greater than 0');
    }

    return this.dataSource.transaction(async (manager) => {
      let wallet = await manager.findOne(Wallet, { where: { userId } });
      if (!wallet) {
        wallet = manager.create(Wallet, {
          userId,
          balance: 0,
          currency: 'INR',
        });
        wallet = await manager.save(wallet);
      }

      const currentBalance = parseFloat(Number(wallet.balance).toString());
      const newBalance = currentBalance + parseFloat(Number(amount).toString());
      wallet.balance = parseFloat(newBalance.toFixed(2));
      await manager.save(wallet);

      const transaction = manager.create(WalletTransaction, {
        walletId: wallet.id,
        amount,
        type: WalletTransactionType.CREDIT,
        referenceId: referenceId || `topup_${Date.now()}`,
        description: description || `Wallet Top-up of ₹${amount}`,
      });
      await manager.save(transaction);

      return {
        id: wallet.id,
        balance: wallet.balance,
        currency: wallet.currency,
        transaction,
      };
    });
  }
}
