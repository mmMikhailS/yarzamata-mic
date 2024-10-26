import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { ResponsePaymentController } from './kafka/app.response.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    JwtModule.register({
      secret: process.env.SECRET_KEY,
    }),
  ],
  controllers: [AppController, ResponsePaymentController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
