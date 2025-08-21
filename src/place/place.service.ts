import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Place } from './place.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PlaceService {
  constructor(
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
  ) {}

  async getAll(): Promise<Place[]> {
    const places = await this.placeRepository.find();
    return places;
  }
}
