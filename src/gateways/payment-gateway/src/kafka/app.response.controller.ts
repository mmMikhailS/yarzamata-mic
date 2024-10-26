import {
  BadRequestException,
  Controller,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { kafka } from './kafka';
import { actionPromise } from '../utils/utils';

@Controller()
export class ResponsePaymentController
  implements OnModuleInit, OnModuleDestroy
{
  consumer: any;

  constructor() {
    this.consumer = kafka.consumer({ groupId: 'payment-response' });
  }

  async onModuleInit() {
    await this.consumer.connect();
    console.log('consumer connected');
    await this.consumer.subscribe({ topic: 'create-order-response' });
    await this.consumer.run({
      eachMessage: async ({ topic, pattern, message }) => {
        if (!message.value)
          throw new BadRequestException('message value equals undefined');
        const { data, messageId } = JSON.parse(message.value);
        if (!data || !messageId)
          throw new BadRequestException('data and messageId equals undefined');
        if (actionPromise[topic]) {
          const pendingRequest = actionPromise[topic].get(messageId);
          await pendingRequest.resolve(data);
        }
      },
    });
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
    console.log('consumer disconnected');
  }
}
