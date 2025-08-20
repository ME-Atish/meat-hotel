import { Module } from '@nestjs/common';
import { ReserveService } from './reserve.service';
import { ReserveController } from './reserve.controller';

@Module({
  providers: [ReserveService],
  controllers: [ReserveController],
})
export class ReserveModule {}
