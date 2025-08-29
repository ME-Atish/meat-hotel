import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PlaceService } from './place.service';
import { Place } from './place.entity';
import { CreatePlaceDto } from 'src/place/dto/create-place.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('place')
@UseGuards(AuthGuard('jwt-access'))
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

  @Post()
  create(@Body() createPlaceDto: CreatePlaceDto): Promise<void> {
    return this.placeService.create(createPlaceDto);
  }

  @Delete('/:id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.placeService.remove(id);
  }

  @Put('/:id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createPlaceDto: CreatePlaceDto,
  ): Promise<object> {
    return this.placeService.update(id, createPlaceDto);
  }
}
