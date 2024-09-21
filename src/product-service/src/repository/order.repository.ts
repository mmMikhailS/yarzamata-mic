import { Injectable } from '@nestjs/common';
import { Order } from '../schemes/order.scheme';
import { createOrderDto } from '../dto/productDto/CreateOrder.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel('Order') private readonly orderModel: Model<Order>,
  ) {}

  async createOrder(dto: createOrderDto) {
    const createdOrder = new this.orderModel({
      status: dto.status,
      items: dto.items,
      user: dto.user,
    });
    return await createdOrder.save();
  }
}
