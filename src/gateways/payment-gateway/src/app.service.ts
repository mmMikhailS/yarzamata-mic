import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ShippingAddressDto } from './dto/paymentDto/shippingAddress.Dto';
import { ProductDto } from './dto/paymentDto/paymentProducts.dto';
import { kafka } from './kafka/kafka';
import { v4 as uuidv4 } from 'uuid';
import { createOrderPromise, Message } from './utils/utils';

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {
  producer: any;

  constructor() {
    this.producer = kafka.producer();
  }

  async onModuleInit() {
    await this.producer.connect();
    console.log('producer connected');
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    console.log('producer connected');
  }

  private async promiseSendMessage(
    data: any,
    mapPromise: any,
    topic: 'create-order',
  ) {
    const messageId = uuidv4();
    console.log(1);
    const promise = new Promise((resolve, reject) => {
      mapPromise.set(messageId, { resolve, reject });
    });
    console.log(1);

    await this.producer
      .send({
        topic,
        messages: [{ value: JSON.stringify(new Message(data, messageId)) }],
      })
      .then((result) => {
        console.log('message sent: ' + result);
        return result;
      })
      .catch((e) => {
        console.error(`payment gateway error: ` + e);
        throw e;
      });
    console.log(1);

    return await promise;
  }

  async createOrder(paymentData: {
    shippingAddress: ShippingAddressDto;
    products: ProductDto[];
  }) {
    return await this.promiseSendMessage(
      paymentData,
      createOrderPromise,
      'create-order',
    );
  }
}
