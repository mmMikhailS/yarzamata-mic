import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ShippingAddressDto } from './dto/paymentDto/shippingAddress.Dto';
import { ProductDto } from './dto/paymentDto/paymentProducts.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthMiddleware } from './middleware/auth.middleware';
import { catchError } from 'rxjs';
import { CreateOrderResponse } from './responses/createOrder.responses';

@Controller('payment')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiTags('Payment')
  @ApiOperation({ summary: 'create order' })
  @CreateOrderResponse()
  @UseGuards(AuthMiddleware)
  @Post('createOrder')
  createOrder(
    @Body()
    paymentData: {
      shippingAddress: ShippingAddressDto;
      products: ProductDto[];
    },
    @Res() res: any,
  ) {
    const createdOrder$ = this.appService.createOrder(paymentData);

    createdOrder$
      .pipe(
        catchError((e) => {
          res.json(400).json({ message: e.message });
          return [];
        }),
      )
      .subscribe((createdOrder) => {
        res.json({ createdOrder });
      });
  }
}
