import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from './repository/user.repository';
import { ActivateRepository } from './repository/activate.repository';
import { TokenService } from './services/token.service';
import { TokenRepository } from './repository/token.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_KEY,
    }),
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
    //             configService.get<string>('CLIENT_AUTH_ID') || 'auth-service',
    //           brokers: [
    //             configService.get<string>('KAFKA_BROKER') || 'localhost:9092',
    //           ],
    //         },
    //         consumer: {
    //           groupId: configService.get<string>('CONSUMER_AUTH_ID') || 'auth',
    //         },
    //       },
    //     }),
    //   },
    // ]),
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
  exports: [],
})
export class AuthServiceModule {}
