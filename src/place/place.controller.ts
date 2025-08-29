import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
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

  @Get('/owner-places')
  getOwnerPlaces(@Req() req): Promise<Place[]> {
    const userId = req.user.id;
    return this.placeService.getOwnerPlaces(userId);
  }

  @Get('/owner-place/:id')
  getOneOwnerPlace(
    @Req() req,
    @Param('id', ParseUUIDPipe) placeId: string,
  ): Promise<Place> {
    const userId = req.user.id;
    return this.placeService.getOneOwnerPlace(userId, placeId);
  }

  @Get('/:id')
  getOne(@Param('id', ParseUUIDPipe) id: string): Promise<Place> {
    return this.placeService.getOne(id);
  }

  @Post()
  create(@Body() createPlaceDto: CreatePlaceDto, @Req() req): Promise<void> {
    const id = req.user.id;
    return this.placeService.create(createPlaceDto, id);
  }

  @Delete('/:id')
  remove(
    @Req() req,
    @Param('id', ParseUUIDPipe) placeId: string,
  ): Promise<void> {
    const userId = req.user.id;
    return this.placeService.remove(userId, placeId);
  }

  @Put('/:id')
  update(
    @Req() req,
    @Param('id', ParseUUIDPipe) placeId: string,
    @Body() createPlaceDto: CreatePlaceDto,
  ): Promise<void> {
    const userId = req.user.id;
    return this.placeService.update(userId, placeId, createPlaceDto);
  }
}
