import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Wallet } from 'src/wallet/wallet.entity';
import { TokenService } from 'src/tokens/token.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly authRepository: Repository<User>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    private readonly tokenService: TokenService,
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
      },
    });

    if (isUserExist) {
      throw new ConflictException('Username already exist');
    }

    const isEmailExist = await this.authRepository.findOne({
      where: { email },
    });

    if (isEmailExist) throw new ConflictException('Email already exist');

    const hashPassword = await bcrypt.hash(password, 10);

    const user = this.authRepository.create({
      username,
      firstName,
      lastName,
      email,
      phone,
      password: hashPassword,
    });
    await this.authRepository.save(user);

    const wallet = this.walletRepository.create({
      user,
    });
    await this.walletRepository.save(wallet);

    return;
  }

  async login(loginUserDto: LoginUserDto): Promise<object> {
    const { identifier, password } = loginUserDto;

    const user = await this.authRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('username = :identifier OR email = :identifier', { identifier })
      .getOne();

    if (!user) throw new UnauthorizedException('username or email not found');

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) throw new UnauthorizedException();

    const accessToken = await this.tokenService.accessToken(user);
    const refreshToken = await this.tokenService.refreshToken(user);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    user.refreshToken = hashedRefreshToken;
    await this.authRepository.save(user);

    return { accessToken, refreshToken };
  }

  async refreshToken(user: User): Promise<string> {
    return await this.tokenService.refreshToken(user);
  }
}
