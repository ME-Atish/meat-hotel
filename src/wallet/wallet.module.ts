import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './wallet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet])],
  providers: [WalletService],
  controllers: [WalletController],
})
export class WalletModule {}
