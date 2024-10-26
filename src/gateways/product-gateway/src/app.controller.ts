import {
  Body,
  Controller,
  Delete,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetAllProductsResponse } from './responses/productResponses/getAllProducts.response';
import { CreateProductResponse } from './responses/productResponses/createProduct.response';
import { CreateProductTypeResponse } from './responses/productResponses/createType.response';
import { DeleteProductResponse } from './responses/productResponses/deleteProduct.response';
import { DeleteProductTypeResponse } from './responses/productResponses/deleteType.response';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiTags('Product')
  @ApiOperation({
    summary:
      'get all  product ( mb with sort by category and (от большего к меньшему)',
  })
  @GetAllProductsResponse()
  @Post('products')
  async getAllProducts(
    @Body() sort: { field: string; order: 'asc' | 'desc' }[],
    @Res() res: any,
  ) {
    try {
      const products = await this.appService.getAllProducts(sort);
      res.json(products);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  @ApiTags('Product')
  @ApiOperation({ summary: 'create product' })
  @CreateProductResponse()
  @UseInterceptors(FileInterceptor('file'))
  @Post('create-product')
  async createProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body('name') name: string,
    @Body('content') content: string,
    @Body('typeName') typeName: string,
    @Body('price') price: string,
    @Res() res: any,
  ) {
    try {
      const data = {
        product: {
          name,
          content,
          typeName,
          price,
        },
        file,
      };
      const createdProduct = await this.appService.createProduct(data);
      res.json(createdProduct);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  @ApiTags('Product')
  @ApiOperation({ summary: 'create product type' })
  @CreateProductTypeResponse()
  @Post('create-product-type')
  async createProductType(@Body() type: { name: string }, @Res() res: any) {
    try {
      const newType = await this.appService.createProductType(type.name);
      res.json(newType);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  @ApiTags('Product')
  @ApiOperation({ summary: 'delete product' })
  @DeleteProductResponse()
  @Delete('delete-product')
  async deleteProduct(@Body() name: string, @Res() res: any) {
    try {
      const deletedProduct = await this.appService.deleteProduct(name);
      res.json(deletedProduct);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  @ApiTags('Product')
  @ApiOperation({ summary: 'delete product type' })
  @DeleteProductTypeResponse()
  @Delete('delete-product-type')
  async deleteProductType(@Body() name: string, @Res() res: any) {
    try {
      const deletedType = await this.appService.deleteProductType(name);
      res.json(deletedType);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
}
