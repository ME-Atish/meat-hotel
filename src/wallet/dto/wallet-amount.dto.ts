import { IsNotEmpty, IsNumber } from 'class-validator';

export class WalletAmountDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
