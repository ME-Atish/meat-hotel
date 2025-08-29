import { Body, Controller, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletAmountDto } from './dto/wallet-amount.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('wallet')
@UseGuards(AuthGuard('jwt-access'))
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Patch('/increase')
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
