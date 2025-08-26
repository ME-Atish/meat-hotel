import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ReserveService } from './reserve.service';
import { Reserve } from './reserve.entity';

@Controller('reserve')
export class ReserveController {
  constructor(private readonly reserveService: ReserveService) {}

  @Get()
  getAll(): Promise<Reserve[]> {
    return this.reserveService.getAll();
  }

  @Delete('/cancel/:id')
  cancelReservation(@Param('id') id: string): Promise<void> {
    return this.reserveService.cancelReservation(id);
  }

  @Post('/:placeId/:userId')
  reservePlace(
    @Param('placeId', ParseUUIDPipe) placeId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<void> {
    return this.reserveService.reservePlace(placeId, userId);
  }
}
