import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reserve } from './reserve.entity';
import { Repository } from 'typeorm';
import { Place } from 'src/place/place.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class ReserveService {
  constructor(
    @InjectRepository(Reserve)
    private readonly reserveRepository: Repository<Reserve>,
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAll(): Promise<Reserve[]> {
    const reserves = await this.reserveRepository.find();
    return reserves;
  }

  async reservePlace(placeId: string, userId: string): Promise<void> {
    const placeInfo = await this.placeRepository.findOne({
      where: { id: placeId },
    });

    if (!placeInfo) throw new NotFoundException('Place not found');

    if (placeInfo.isReserved)
      throw new ConflictException('Place already reserved');

    const userInfo = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!userInfo) throw new NotFoundException('User not found');

    if (userInfo?.isReserved)
      throw new ConflictException('User already reserved place');

    const reserve = this.reserveRepository.create({
      place: placeInfo,
      user: userInfo,
    });

    await this.reserveRepository.save(reserve);

    await this.placeRepository.update(placeId, {
      isReserved: true,
    });

    await this.userRepository.update(userId, {
      isReserved: true,
    });

    return;
  }

  async cancelReservation(id: string): Promise<void> {
    const findReservation = await this.reserveRepository.findOne({
      where: { id },
    });

    if (!findReservation) throw new NotFoundException('Reservation not found');

    const findPlaceForCancelReservation = await this.placeRepository.findOne({
      where: { id: findReservation.place.id },
    });

    if (!findPlaceForCancelReservation)
      throw new NotFoundException('Place not found');

    await this.placeRepository.update(findPlaceForCancelReservation.id, {
      isReserved: false,
    });

    const findUserForCancelReservation = await this.userRepository.findOne({
      where: { id: findReservation.user.id },
    });

    if (!findUserForCancelReservation)
      throw new NotFoundException('User not found');

    await this.userRepository.update(findUserForCancelReservation.id, {
      isReserved: false,
    });

    await this.reserveRepository.remove(findReservation);

    return;
  }
}
