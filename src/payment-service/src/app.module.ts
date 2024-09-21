import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import {
  ClientProvider,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [AppController],
  providers: [PrismaService, AppService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.registerAsync([
      {
        name: 'PAYMENT_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService): ClientProvider => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('HOST') || 'localhost',
            port: configService.get<number>('PAYMENT_MODULE_PORT') || 3003,
          },
        }),
      },
    ]),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
    }),
  ],
})
export class AppModule {}
