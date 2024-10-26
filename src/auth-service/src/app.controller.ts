import {
  BadRequestException,
  Controller,
  InternalServerErrorException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { AppService } from './app.service';
import { kafka } from './kafka/kafka';
import { Message, subscribeTopics } from './utils/utils';
import { loginDto } from './dto/authDto/login.dto';
import { changePassDto } from './dto/authDto/changePass.dto';
import { registrationUserDto } from './dto/authDto/registrationUserDto.dto';

@Controller()
export class AppController implements OnModuleInit, OnModuleDestroy {
  private consumer: any;
  private producer: any;

  constructor(private readonly authService: AppService) {
    this.consumer = kafka.consumer({ groupId: 'auth' });
    this.producer = kafka.producer();
  }

  async onModuleInit() {
    try {
      type topicHandler = (data: any, messageId: string) => Promise<any>;
      const topics: Record<string, topicHandler> = {
        'register-user': this.register.bind(this),
        'login-user': this.login.bind(this),
        'change-password': this.changePassword.bind(this),
        refresh: this.refresh.bind(this),
        'activate-account': this.activateAccount.bind(this),
      };
      await this.producer.connect();
      await this.consumer.connect();
      console.log('consumer and producer connected');
      for (const topic of subscribeTopics) {
        await this.consumer.subscribe({ topic });
      }
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          console.log(JSON.parse(message.value));
          if (!message.value)
            throw new BadRequestException('message value equals undefined');
          const value = JSON.parse(message.value);
          if (!value)
            throw new BadRequestException('message value equals undefined');
          if (!topics[topic])
            throw new InternalServerErrorException('function equals undefined');
          await topics[topic](value.data, value.messageId);
        },
      });
    } catch (e) {
      console.error('Error connecting to Kafka', e);
      throw e;
    }
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
    console.log('consumer and producer disconnected');
  }

  async register(data: registrationUserDto, messageId: string) {
    const result = await this.authService.register(data);
    await this.producer.send({
      topic: 'register-user-response',
      messages: [{ value: JSON.stringify(new Message(result, messageId)) }],
    });
  }

  async login(data: loginDto, messageId: string) {
    const result = await this.authService.login(data);
    await this.producer.send({
      topic: 'login-user-response',
      messages: [{ value: JSON.stringify(new Message(result, messageId)) }],
    });
  }

  async changePassword(data: changePassDto, messageId: string) {
    const result = await this.authService.changePassword(data);
    await this.producer.send({
      topic: 'change-password-response',
      messages: [{ value: JSON.stringify(new Message(result, messageId)) }],
    });
  }

  async refresh(refreshToken: string, messageId: string) {
    const result = await this.authService.refresh(refreshToken);
    await this.producer.send({
      topic: 'refresh-response',
      messages: [{ value: JSON.stringify(new Message(result, messageId)) }],
    });
  }

  async activateAccount(
    data: { code: any; refreshToken: string },
    messageId: string,
  ) {
    const result = await this.authService.activateAccount(
      data.code,
      data.refreshToken,
    );
    await this.producer.send({
      topic: 'activate-account-response',
      messages: [{ value: JSON.stringify(new Message(result, messageId)) }],
    });
  }
}
