import {
  BadRequestException,
  Controller,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { kafka } from './kafka/kafka';
import { AppService } from './app.service';
import { Message } from './utils/utils';

@Controller()
export class AppController implements OnModuleInit, OnModuleDestroy {
  consumer: any;
  producer: any;

  constructor(private readonly appService: AppService) {
    this.consumer = kafka.consumer({ groupId: 'payment' });
    this.producer = kafka.producer();
  }

  async onModuleInit() {
    type messageHandler = (data: any, messageId: string, topic: string) => any;
    const actionService: Record<string, messageHandler> = {
      'create-order': this.createOrderHandler.bind(this),
    };
    await this.producer.connect();
    await this.consumer.connect();
    console.log('consumer and producer connected');
    await this.consumer.subscribe({ topic: 'create-order' });
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
        if (actionService[topic]) {
          await actionService[topic](data, messageId, topic);
        }
      },
    });
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
    await this.producer.disconnect();
    console.log('consumer and producer disconnected');
  }

  async createOrderHandler(data: any, messageId: string, topic: string) {
    const result = await this.appService.createOrder(data);
    console.log(result);
    await this.producer.send({
      topic: topic + '-response',
      messages: [{ value: JSON.stringify(new Message(result, messageId)) }],
    });
  }
}
