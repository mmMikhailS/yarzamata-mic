import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createProductDto } from './dto/productDto/createProduct.dto';
import { kafka } from './kafka/kafka';
import { v4 as uuidv4 } from 'uuid';
import {
  Message,
  promiseCreateProduct,
  promiseCreateProductType,
  promiseDeleteProduct,
  promiseDeleteProductType,
  promiseGetAllMessages,
  topics,
} from './utils/utils';

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
    console.log('producer disconnected');
  }

  private async promiseSendMessage(data: any, promiseMap: any, topic: topics) {
    const messageId = uuidv4();
    const promise = new Promise((resolve, reject) => {
      promiseMap.set(messageId, { resolve, reject });
    });

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
    return await promise;
  }

  async getAllProducts(sort: { field: string; order: 'asc' | 'desc' }[]) {
    try {
      return await this.promiseSendMessage(
        sort,
        promiseGetAllMessages,
        'get-all-products',
      );
    } catch (e) {
      throw e;
    }
  }

  async createProduct(data: {
    product: createProductDto;
    file: Express.Multer.File;
  }) {
    try {
      return await this.promiseSendMessage(
        data,
        promiseCreateProduct,
        'create-product',
      );
    } catch (e) {
      throw e;
    }
  }

  async createProductType(name: string) {
    try {
      return await this.promiseSendMessage(
        name,
        promiseCreateProductType,
        'create-product-type',
      );
    } catch (e) {
      throw e;
    }
  }

  async deleteProduct(name: string) {
    try {
      return await this.promiseSendMessage(
        name,
        promiseDeleteProduct,
        'delete-product',
      );
    } catch (e) {
      throw e;
    }
  }

  async deleteProductType(name: string) {
    try {
      return await this.promiseSendMessage(
        name,
        promiseDeleteProductType,
        'delete-product-type',
      );
    } catch (e) {
      throw e;
    }
  }
}
