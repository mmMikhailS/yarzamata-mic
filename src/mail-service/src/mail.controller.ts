import {
  BadRequestException,
  Controller,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { kafka } from './utils/kafka';
import { AppService } from './app.service';

@Controller('mail')
export class MailController implements OnModuleInit, OnModuleDestroy {
  consumer: any;
  topics: any;

  constructor(private readonly mailService: AppService) {
    this.consumer = kafka.consumer({ groupId: 'mail' });
    this.topics = ['verification-mail', 'login-mail', 'change-password-mail'];
  }

  async onModuleInit() {
    type handlerType = (to: string, code: string | null) => any;
    const mailServices: Record<string, handlerType> = {
      'verification-mail': this.mailService.VerificationMail.bind(this),
      'login-mail': this.mailService.LoginMail.bind(this),
      'change-password-mail': this.mailService.ChangedPasswordMail.bind(this),
    };
    await this.consumer.connect();
    console.log('consumer connected');
    for (const topic of this.topics) {
      await this.consumer.subscribe({ topic });
    }
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (!message.value)
          throw new BadRequestException('message value equals undefined');
        const value = JSON.parse(message.value);
        if (!value)
          throw new BadRequestException('message value equals undefined');
        const { to, code } = value;
        if (!to) throw new BadRequestException('to equals undefined');
        if (mailServices[topic]) {
          return await mailServices[topic](to, code);
        }
      },
    });
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
    console.log('consumer disconnected');
  }
}
