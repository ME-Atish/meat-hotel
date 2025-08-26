import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletAmountDto } from './dto/wallet-amount.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('/increase/:userId')
  increase(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() walletAmountDto: WalletAmountDto,
  ): Promise<void> {
    return this.walletService.increase(userId, walletAmountDto);
  }

  @Patch('/decrease/:userId')
  decrease(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() walletAmountDto: WalletAmountDto,
  ): Promise<void> {
    return this.walletService.decrease(userId, walletAmountDto);
  }
}
