import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ShippingAddressDto } from './dto/paymentDto/shippingAddress.Dto';
import { ProductDto } from './dto/paymentDto/paymentProducts.dto';

@Injectable()
export class AppService {
  constructor(
    @Inject('PAYMENT_SERVICE') private readonly paymentClient: ClientProxy,
  ) {}

  createOrder(paymentData: {
    shippingAddress: ShippingAddressDto;
    products: ProductDto[];
  }) {
    return this.paymentClient.send({ cmd: 'create-order' }, paymentData);
  }
}
