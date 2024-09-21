import { Injectable } from '@nestjs/common';
import { ProductRepository } from './repository/product.repository';
import { memoryStorage } from 'multer';
import { createProductDto } from './dto/productDto/createProduct.dto';

@Injectable()
export class ProductService {
  private storage = memoryStorage();

  constructor(private productRepository: ProductRepository) {}

  async createProduct(dto: createProductDto, file: Express.Multer.File) {
    const imageBuffer = file.buffer;
    return await this.productRepository.createProduct(dto, imageBuffer);
  }
}
