import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/jwt-access-token.strategy';
import { RefreshTokenStrategy } from './strategies/jwt-refresh-token.strategy';
import { Wallet } from 'src/wallet/wallet.entity';
import { TokenModule } from 'src/tokens/token.module';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { GenerateRandomCode } from 'src/utils/generate-random-code';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt-access' }),
    PassportModule.register({ defaultStrategy: 'google' }),
    JwtModule.register({}),
    TokenModule,
    TypeOrmModule.forFeature([User, Wallet]),
  ],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    AccessTokenGuard,
    GenerateRandomCode,
    GoogleStrategy,
  ],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
