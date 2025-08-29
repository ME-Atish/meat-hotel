import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { WalletModule } from './wallet/wallet.module';
import { PlaceModule } from './place/place.module';
import { ReserveModule } from './reserve/reserve.module';
import { UserModule } from './user/user.module';
import * as dotenv from 'dotenv';
import { IsOwnerMiddleware } from './middleware/is-owner.middleware';
import { PlaceController } from './place/place.controller';
import { IsAdminMiddleware } from './middleware/is-admin.middleware';
import { UserController } from './user/user.controller';
import { MailerModule } from '@nestjs-modules/mailer';
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

    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        host: `${process.env.EMAIL_HOST}`,
        auth: {
          user: `${process.env.EMAIL}`,
          pass: `${process.env.EMAIL_PASSWORD}`,
        },
      },
    }),

    AuthModule,
    PlaceModule,
    WalletModule,
    ReserveModule,
    UserModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IsOwnerMiddleware)
      .exclude(
        { path: '/', method: RequestMethod.GET },
        { path: '/:id', method: RequestMethod.GET },
      )
      .forRoutes(PlaceController);

    consumer
      .apply(IsAdminMiddleware)
      .exclude({ path: '/:id', method: RequestMethod.PUT })
      .forRoutes(UserController);
  }
}
