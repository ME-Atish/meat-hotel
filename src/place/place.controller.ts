import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { PlaceService } from './place.service';
import { Place } from './place.entity';

@Controller('place')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Get()
  getAll(): Promise<Place[]> {
    return this.placeService.getAll();
  }

  @Get('/:id')
  getOne(@Param('id', ParseUUIDPipe) id: string): Promise<Place> {
    return this.placeService.getOne(id);
  }
}
