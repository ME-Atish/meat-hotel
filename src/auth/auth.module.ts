import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt-access-token.strategy';
import { Wallet } from 'src/wallet/wallet.entity';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt-access-token' }),
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET || 'dpeqdjqejdqo',
      signOptions: {
        expiresIn: '15d',
        algorithm: 'HS512',
      },
    }),

    TypeOrmModule.forFeature([User, Wallet]),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
