import {
  BadRequestException,
  Controller,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { kafka } from './kafka';
import { actionPromise, responseTopics } from '../utils/utils';

@Controller()
export class AppResponseController implements OnModuleInit, OnModuleDestroy {
  consumer: any;

  constructor() {
    this.consumer = kafka.consumer({ groupId: 'product-response' });
  }

  async onModuleInit() {
    await this.consumer.connect();
    console.log('consumer connected');
    for (const topic of responseTopics) {
      await this.consumer.subscribe({ topic });
    }
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (!message.value)
          throw new BadRequestException('message value equals undefined');
        const value = JSON.parse(message.value);
        if (!value)
          throw new BadRequestException('message value equals undefined');
        const { data, messageId } = value;
        if (!data || !messageId)
          throw new BadRequestException('data or messageId equals undefined');
        if (actionPromise[topic]) {
          const promise = actionPromise[topic].get(messageId);
          promise.resolve(data);
        }
      },
    });
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
    console.log('consumer disconnect');
  }
}
