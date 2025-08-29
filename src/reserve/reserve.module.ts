import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserve } from './reserve.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ReserveService } from './reserve.service';
import { ReserveController } from './reserve.controller';
import { Place } from 'src/place/place.entity';
import { User } from 'src/auth/user.entity';
import { Wallet } from 'src/wallet/wallet.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reserve, Place, User, Wallet]),
    AuthModule,
  ],
  providers: [ReserveService],
  controllers: [ReserveController],
})
export class ReserveModule {}
