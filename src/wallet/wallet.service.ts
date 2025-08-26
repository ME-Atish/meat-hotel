import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './wallet.entity';
import { Repository } from 'typeorm';
import { WalletAmountDto } from './dto/wallet-amount.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}

  async increase(
    userId: string,
    walletAmountDto: WalletAmountDto,
  ): Promise<void> {
    const { amount } = walletAmountDto;

    const findUserWallet = await this.walletRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!findUserWallet) throw new NotFoundException('wallet not found');

    await this.walletRepository.update(findUserWallet.id, {
      amount: findUserWallet.amount + amount,
    });

    return;
  }
}
