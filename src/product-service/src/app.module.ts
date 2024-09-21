import { Module } from '@nestjs/common';
import { ProductRepository } from './repository/product.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemes/product.scheme';
import { Order, OrderSchema } from './schemes/order.scheme';
import { OrderItem, OrderItemSchema } from './schemes/orderItem.scheme';
import { Type, TypeSchema } from './schemes/productType.scheme';
import { TypeRepository } from './repository/type.repository';
import { MulterModule } from '@nestjs/platform-express';
import { OrderRepository } from './repository/order.repository';
import {
  ClientProvider,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import { AppController } from './app.controller';
import { ProductService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [AppController],
  providers: [
    ProductRepository,
    TypeRepository,
    ProductService,
    PrismaService,
    OrderRepository,
  ],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema }, // Product.name
      { name: Order.name, schema: OrderSchema },
      { name: OrderItem.name, schema: OrderItemSchema },
      { name: Type.name, schema: TypeSchema },
    ]),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    ClientsModule.registerAsync([
      {
        name: 'PRODUCT_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService): ClientProvider => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('HOST') || 'localhost',
            port: configService.get<number>('PRODUCT_MODULE_PORT') || 3004,
          },
        }),
      },
    ]),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
    }),
    MulterModule.register({
      dest: './images',
    }),
  ],
  exports: [ProductRepository, OrderRepository, MongooseModule],
})
export class AppModule {}
