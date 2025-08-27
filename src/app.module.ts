import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { WalletModule } from './wallet/wallet.module';
import { PlaceModule } from './place/place.module';
import { ReserveModule } from './reserve/reserve.module';
import { UserModule } from './user/user.module';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: `${process.env.DB_HOST}`,
      port: 5432,
      username: `${process.env.DB_USERNAME}`,
      password: `${process.env.DB_PASSWORD}`,
      database: `${process.env.DB_DATABASE}`,
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    PlaceModule,
    WalletModule,
    ReserveModule,
    UserModule,
  ],
})
export class AppModule {}
