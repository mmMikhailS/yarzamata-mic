import { Inject, Module, OnModuleInit } from '@nestjs/common';
import {
  ClientKafka,
  ClientProvider,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import { AuthGatewayService } from './authGateway.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { authGatewayResponse } from './kafka/auth.response.controller';
import { AuthGatewayController } from './authGateway.controller';
import { authGatewayResponse } from './kafka/auth.response.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // ClientsModule.registerAsync([
    //   {
    //     name: 'AUTH_SERVICE',
    //     imports: [ConfigModule],
    //     inject: [ConfigService],
    //     useFactory: (configService: ConfigService): ClientProvider => ({
    //       transport: Transport.KAFKA,
    //       options: {
    //         client: {
    //           clientId:
    //             configService.get<string>('CLIENT_AUTH_ID') || 'auth-client',
    //           brokers: [
    //             configService.get<string>('KAFKA_BROKER') || 'localhost:9092',
    //           ],
    //         },
    //         consumer: {
    //           groupId:
    //             configService.get<string>('CONSUMER_AUTH_ID') ||
    //             'auth-response',
    //         },
    //       },
    //     }),
    //   },
    //   {
    //     name: 'MAIL_SERVICE',
    //     imports: [ConfigModule],
    //     inject: [ConfigService],
    //     useFactory: (configService: ConfigService): ClientProvider => ({
    //       transport: Transport.KAFKA,
    //       options: {
    //         client: {
    //           clientId:
    //             configService.get<string>('CLIENT_MAIL_ID') ||
    //             'mail-service-broker',
    //           brokers: [
    //             configService.get<string>('KAFKA_BROKER') || 'localhost:9092',
    //           ],
    //         },
    //         consumer: {
    //           groupId:
    //             configService.get<string>('CONSUMER_MAIL_ID') ||
    //             'mail-consumer-response',
    //         },
    //       },
    //     }),
    //   },
    // ]),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
    }),
  ],
  controllers: [AuthGatewayController],
  providers: [AuthGatewayService, authGatewayResponse], // authGatewayResponse
  exports: [AuthGatewayService],
})
export class AppModule {}
