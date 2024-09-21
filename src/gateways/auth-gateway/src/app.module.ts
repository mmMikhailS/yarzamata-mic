import { Module } from '@nestjs/common';
import {
  ClientProvider,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import { AuthGatewayController } from './authGateway.controller';
import { AuthGatewayService } from './authGateway.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
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
      {
        name: 'MAIL_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService): ClientProvider => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('HOST') || 'localhost',
            port: configService.get<number>('MAIL_MODULE_PORT') || 3002,
          },
        }),
      },
    ]),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
    }),
  ],
  controllers: [AuthGatewayController],
  providers: [AuthGatewayService],
})
export class AppModule {}
