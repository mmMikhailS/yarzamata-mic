import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { JwtModule } from '@nestjs/jwt';
import {
  ClientProvider,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import { UserRepository } from './repository/user.repository';
import { ActivateRepository } from './repository/activate.repository';
import { TokenService } from './services/token.service';
import { TokenRepository } from './repository/token.repository';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_KEY,
    }),
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService): ClientProvider => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('HOST') || 'localhost',
            port: configService.get<number>('AUTH_MODULE_PORT') || 3001,
          },
        }),
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UserRepository,
    ActivateRepository,
    TokenService,
    TokenRepository,
    PrismaService,
  ],
})
export class AppModule {}
