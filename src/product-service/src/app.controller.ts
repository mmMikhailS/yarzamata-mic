import {
  BadRequestException,
  Controller,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ProductRepository } from './repository/product.repository';
import { TypeRepository } from './repository/type.repository';
import { createProductDto } from './dto/productDto/createProduct.dto';
import { ProductService } from './app.service';
import { kafka } from './utils/kafka';
import { Message, topics } from './utils/utils';

@Controller('products')
export class AppController implements OnModuleDestroy, OnModuleInit {
  consumer: any;
  producer: any;

  constructor(
    private productService: ProductService,
    private productRepository: ProductRepository,
    private typeRepository: TypeRepository,
  ) {
    this.consumer = kafka.consumer({ groupId: 'product' });
    this.producer = kafka.producer();
  }

  async onModuleInit() {
    type handler = (data: any, messageId: string, topic: string) => any;
    const messageHandler: Record<string, handler> = {
      'get-all-products': this.getAllProducts.bind(this),
      'create-product': this.createProduct.bind(this),
      'create-product-type': this.createProductType.bind(this),
      'delete-product': this.deleteProduct.bind(this),
      'delete-product-type': this.deleteProductType.bind(this),
    };
    await this.producer.connect();
    await this.consumer.connect();
    await this.consumer.subscribe({ topics });
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
        if (messageHandler[topic]) {
          messageHandler[topic](data, messageId, topic);
        }
      },
    });
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
    console.log('producer and consumer disconnected');
  }

  async getAllProducts(
    sort: [{ field: string; order: 'asc' | 'desc' }],
    messageId: string,
    topic: string,
  ) {
    try {
      const result = await this.productRepository.getAllProducts(sort);
      await this.producer.send({
        topic: topic + '-response',
        messages: [{ value: JSON.stringify(new Message(result, messageId)) }],
      });
    } catch (e) {
      throw e;
    }
  }

  async createProduct(
    data: { product: createProductDto; file: Express.Multer.File },
    messageId: string,
    topic: string,
  ) {
    try {
      const result = await this.productService.createProduct(
        data.product,
        data.file,
      );
      await this.producer.send({
        topic: topic + '-response',
        messages: [{ value: JSON.stringify(new Message(result, messageId)) }],
      });
      console.log(topic);
    } catch (e) {
      throw e;
    }
  }

  async createProductType(name: string, messageId: string, topic: string) {
    try {
      const result = await this.typeRepository.createType(name);
      await this.producer.send({
        topic: topic + '-response',
        messages: [{ value: JSON.stringify(new Message(result, messageId)) }],
      });
      console.log(1);
    } catch (e) {
      throw e;
    }
  }

  async deleteProduct(
    data: { name: string },
    messageId: string,
    topic: string,
  ) {
    try {
      const result = await this.productRepository.deleteByName(data.name);
      console.log(result);
      await this.producer.send({
        topic: topic + '-response',
        messages: [
          {
            value: JSON.stringify(new Message(result, messageId)),
          },
        ],
      });
    } catch (e) {
      throw e;
    }
  }

  async deleteProductType(
    data: { name: string },
    messageId: string,
    topic: string,
  ) {
    try {
      console.log(1);
      const result = await this.typeRepository.deleteType(data.name);
      console.log(result);
      await this.producer.send({
        topic: topic + '-response',
        messages: [{ value: JSON.stringify(new Message(result, messageId)) }],
      });
    } catch (e) {
      throw e;
    }
  }
}
