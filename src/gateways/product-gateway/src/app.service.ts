import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { createProductDto } from './dto/productDto/createProduct.dto';

@Injectable()
export class AppService {
  constructor(
    @Inject('PRODUCT_SERVICE') private readonly paymentClient: ClientProxy,
  ) {}

  getAllProducts(sort: { field: string; order: 'asc' | 'desc' }[]) {
    try {
      return this.paymentClient.send({ cmd: 'get-all-products' }, sort);
    } catch (e) {
      throw e;
    }
  }

  createProduct(dto: createProductDto, file: Express.Multer.File) {
    try {
      return this.paymentClient.send({ cmd: 'create-product' }, { dto, file });
    } catch (e) {
      throw e;
    }
  }

  createProductType(name: string) {
    try {
      console.log(1);
      return this.paymentClient.send({ cmd: 'create-product-type' }, name);
    } catch (e) {
      throw e;
    }
  }

  deleteProduct(name: string) {
    try {
      return this.paymentClient.send({ cmd: 'delete-product' }, { name });
    } catch (e) {
      throw e;
    }
  }

  deleteProductType(name: string) {
    try {
      return this.paymentClient.send({ cmd: 'delete-product-type' }, { name });
    } catch (e) {
      throw e;
    }
  }
}
