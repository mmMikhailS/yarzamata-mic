import { Controller, Get } from '@nestjs/common';
import { MailGatewayService } from './app.service';

@Controller()
export class MailGatewayController {
  constructor(private readonly appService: MailGatewayService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
