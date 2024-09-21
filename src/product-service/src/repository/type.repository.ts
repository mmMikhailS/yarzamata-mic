import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Type } from '../schemes/productType.scheme';

@Injectable()
export class TypeRepository {
  constructor(@InjectModel('Type') private readonly typeModel: Model<Type>) {}

  async createType(name: string) {
    try {
      const createdType = new this.typeModel({ name });

      return await createdType.save();
    } catch (e) {
      throw e;
    }
  }

  deleteType(name: string) {
    return this.typeModel.findOneAndDelete({ name }).exec();
  }
}
