import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
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

  @Get('/:id')
  getOne(@Param('id', ParseUUIDPipe) id: string): Promise<Reserve> {
    return this.reserveService.getOne(id);
  }

  @Delete('/cancel/:id')
  cancelReservation(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.reserveService.cancelReservation(id);
  }

  @Post('/:placeId')
  reservePlace(
    @Req() req,
    @Param('placeId', ParseUUIDPipe) placeId: string,
  ): Promise<void> {
    const userId = req.user.id;
    return this.reserveService.reservePlace(placeId, userId);
  }
}
