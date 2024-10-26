import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppService } from './app.service';
import { PrismaService } from '../prisma/prisma.service';
import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
  providers: [PrismaService, AppService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
    }),
  ],
})
export class AppModule {}
