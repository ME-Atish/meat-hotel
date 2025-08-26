import { Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ReserveService } from './reserve.service';

@Controller('reserve')
export class ReserveController {
  constructor(private readonly reserveService: ReserveService) {}

  @Post('/:placeId/:userId')
  reservePlace(
    @Param('placeId', ParseUUIDPipe) placeId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<void> {
    return this.reserveService.reservePlace(placeId, userId);
  }
}
