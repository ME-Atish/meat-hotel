import { Body, Controller, Patch, Post, Req } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletAmountDto } from './dto/wallet-amount.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('/increase')
  increase(
    @Req() req,
    @Body() walletAmountDto: WalletAmountDto,
  ): Promise<void> {
    const userId = req.user.id;
    return this.walletService.increase(userId, walletAmountDto);
  }

  @Patch('/decrease')
  decrease(
    @Req() req,
    @Body() walletAmountDto: WalletAmountDto,
  ): Promise<void> {
    const userId = req.user.id;
    return this.walletService.decrease(userId, walletAmountDto);
  }
}
