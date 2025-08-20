import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly authRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async getAll(): Promise<User[]> {
    const users = await this.authRepository.find();
    return users;
  }

  async register(createUserDto: CreateUserDto): Promise<void> {
    const { username, firstName, lastName, email, phone, password } =
      createUserDto;

    const isUserExist = await this.authRepository.findOne({
      where: {
        username,
        email,
      },
    });

    if (isUserExist) {
      throw new ConflictException('Username already exist');
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = this.authRepository.create({
      username,
      firstName,
      lastName,
      email,
      phone,
      password: hashPassword,
      refreshToken: 'dpqwjdp',
    });

    await this.authRepository.save(user);

    return;
  }
}
