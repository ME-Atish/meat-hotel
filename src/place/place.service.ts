import { Injectable, NotFoundException } from '@nestjs/common';
import { Not, Repository } from 'typeorm';
import { Place } from './place.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePlaceDto } from 'src/place/dto/create-place.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class PlaceService {
  constructor(
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

  async create(createPlaceDto: CreatePlaceDto, id: string): Promise<void> {
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

    const user = await this.userRepository.findOne({ where: { id } });
    if (!user)
      throw new NotFoundException('user not found, please check access token');

    await this.userRepository.update(user.id, { isOwner: true });

    createPlace.owner = user;

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

    if (place.affected === 0) throw new NotFoundException('Place not found');

    return { message: 'Place updated successfully' };
  }

  async getOwnerPlaces(userId: string): Promise<Place[]> {
    const findUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!findUser)
      throw new NotFoundException('user not found. check access token');

    const places = await this.placeRepository.find({
      where: {
        owner: { id: findUser.id },
      },
    });

    return places;
  }

  async getOneOwnerPlace(userId: string, placeId: string): Promise<Place> {
    const findUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!findUser)
      throw new NotFoundException('user not found. check access token');

    const place = await this.placeRepository.findOne({
      where: {
        owner: { id: findUser.id },
        id: placeId,
      },
    });

    if (!place) throw new NotFoundException('Place not found');

    return place;
  }
}
