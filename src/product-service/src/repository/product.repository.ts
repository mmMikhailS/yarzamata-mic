import { Injectable } from '@nestjs/common';
import { Product } from '../schemes/product.scheme';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createProductDto } from '../dto/productDto/createProduct.dto';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async getAllProducts(sort: [{ field: string; order: 'asc' | 'desc' }]) {
    console.log(sort);
    const sortOptions = sort.reduce((acc, curr) => {
      acc[curr.field] = curr.order === 'asc' ? 1 : -1;
      return acc;
    }, {});
    return this.productModel.find().sort(sortOptions).exec();
  }

  async createProduct(dto: createProductDto, imageBuffer: Buffer) {
    const createdProduct = new this.productModel({
      name: dto.name,
      content: dto.content,
      type: dto.typeName, // возможно стоит кидать айдишник
      imageBuffer,
      price: dto.price,
    });
    return await createdProduct.save();
  }

  async deleteByName(name: string): Promise<Product | null> {
    return await this.productModel.findOneAndDelete({ name }).exec();
  }
}
