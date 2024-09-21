import { Module } from '@nestjs/common';
import { MailGatewayController } from './app.controller';
import { MailGatewayService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MAIL_SERVICE',
        transport: Transport.TCP,
        options: { host: process.env.HOST, port: 3002 },
      },
    ]),
  ],
  controllers: [MailGatewayController],
  providers: [MailGatewayService],
})
export class AppModule {}
