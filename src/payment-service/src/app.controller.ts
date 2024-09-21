import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ShippingAddressDto } from './dto/paymentDto/shippingAddress.Dto';
import { ProductDto } from './dto/paymentDto/paymentProducts.dto';
import { AppService } from './app.service';

@Controller('payment')
export class AppController {
  constructor(private paymentService: AppService) {}

  @MessagePattern({ cmd: 'create-order' })
  async createOrder(paymentData: {
    shippingAddress: ShippingAddressDto;
    products: ProductDto[];
  }) {
    return await this.paymentService.createOrder(
      paymentData.shippingAddress,
      paymentData.products,
      // paymentData.cardDetails,
    );
  }
}
