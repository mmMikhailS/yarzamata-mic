import { Controller } from '@nestjs/common';
import { ProductRepository } from './repository/product.repository';
import { TypeRepository } from './repository/type.repository';
import { MessagePattern } from '@nestjs/microservices';
import { createProductDto } from './dto/productDto/createProduct.dto';
import { ProductService } from './app.service';

@Controller('products')
export class AppController {
  constructor(
    private productService: ProductService,
    private productRepository: ProductRepository,
    private typeRepository: TypeRepository,
  ) {}

  @MessagePattern({ cmd: 'get-all-products' })
  getAllProducts(sort: { field: string; order: 'asc' | 'desc' }[]) {
    try {
      return this.productRepository.getAllProducts(sort);
    } catch (e) {
      throw e;
    }
  }

  @MessagePattern({ cmd: 'create-product' })
  createProduct(dto: createProductDto, file: Express.Multer.File) {
    try {
      return this.productService.createProduct(dto, file);
    } catch (e) {
      throw e;
    }
  }

  @MessagePattern({ cmd: 'create-product-type' })
  createProductType(name: string) {
    try {
      console.log(name);
      return this.typeRepository.createType(name);
    } catch (e) {
      throw e;
    }
  }

  @MessagePattern({ cmd: 'delete-product' })
  deleteProduct(name: string) {
    try {
      return this.productRepository.deleteByName(name);
    } catch (e) {
      throw e;
    }
  }

  @MessagePattern({ cmd: 'delete-product-type' })
  deleteProductType(name: string) {
    try {
      return this.typeRepository.deleteType(name);
    } catch (e) {
      throw e;
    }
  }
}
