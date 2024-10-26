import { kafka } from './kafka';

import {
  BadRequestException,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { actionPromise, responseTopics } from '../utils/utils';

@Injectable()
export class authGatewayResponse implements OnModuleInit, OnModuleDestroy {
  consumer: any;

  constructor() {
    this.consumer = kafka.consumer({ groupId: 'auth-response' });
  }

  async onModuleInit() {
    try {
      await this.consumer.connect();
      for (const topic of responseTopics) {
        await this.consumer.subscribe({ topic });
      }
      console.log('consumer connected');
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
            const pendingRequest = await actionPromise[topic].get(messageId);
            await pendingRequest.resolve(data);
            return;
          }
        },
      });
    } catch (e) {
      console.error('Error connecting to Kafka', e);
      throw e;
    }
  }

  async onModuleDestroy(): Promise<any> {
    await this.consumer.disconnect();
    console.log('consumer disconnected');
  }
}
