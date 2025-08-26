import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Place } from './place.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePlaceDto } from 'src/auth/dto/create-place.dto';

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

  async getOne(id: string): Promise<Place> {
    const place = await this.placeRepository.findOne({ where: { id } });
    if (!place) throw new NotFoundException('place not found');

    return place;
  }

  async create(createPlaceDto: CreatePlaceDto): Promise<void> {
    const { name, address, description, facilities, price, province, city } =
      createPlaceDto;

    const createPlace = this.placeRepository.create({
      name,
      address,
      description,
      facilities,
      price,
      province,
      city,
    });

    await this.placeRepository.save(createPlace);

    return;
  }

  async remove(id: string): Promise<void> {
    const findPlaceToRemove = await this.placeRepository.findOne({
      where: {
        id,
      },
    });

    if (!findPlaceToRemove) throw new NotFoundException();

    await this.placeRepository.delete(id);
    return;
  }

  async update(id: string, createPlaceDto: CreatePlaceDto): Promise<object> {
    const { name, address, description, facilities, price, province, city } =
      createPlaceDto;

    const place = await this.placeRepository.update(id, {
      name,
      address,
      description,
      facilities,
      price,
      province,
      city,
    });

    if (place.affected === 0) {
      throw new NotFoundException('Place not found');
    }

    return { message: 'Place updated successfully' };
  }
}
