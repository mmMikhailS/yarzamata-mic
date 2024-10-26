import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ShippingAddressDto } from './dto/paymentDto/shippingAddress.Dto';
import { ProductDto } from './dto/paymentDto/paymentProducts.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthMiddleware } from './middleware/auth.middleware';
import { CreateOrderResponse } from './responses/createOrder.responses';

@Controller('payment')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiTags('Payment')
  @ApiOperation({ summary: 'create order' })
  @CreateOrderResponse()
  @UseGuards(AuthMiddleware)
  @Post('createOrder')
  async createOrder(
    @Body()
    paymentData: {
      shippingAddress: ShippingAddressDto;
      products: ProductDto[];
    },
    @Res() res: any,
  ) {
    try {
      const createdOrder = await this.appService.createOrder(paymentData);
      res.json({ createdOrder });
    } catch (e) {
      res.json(400).json({ message: e.message });
    }
  }
}
