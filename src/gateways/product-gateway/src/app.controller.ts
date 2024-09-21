import { Body, Controller, Delete, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { catchError } from 'rxjs';
import { createProductDto } from './dto/productDto/createProduct.dto';
import { GetAllProductsResponse } from './responses/productResponses/getAllProducts.response';
import { CreateProductResponse } from './responses/productResponses/createProduct.response';
import { CreateProductTypeResponse } from './responses/productResponses/createType.response';
import { DeleteProductResponse } from './responses/productResponses/deleteProduct.response';
import { DeleteProductTypeResponse } from './responses/productResponses/deleteType.response';

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
    const products$ = await this.appService.getAllProducts(sort);

    products$
      .pipe(
        catchError((e) => {
          res.status(400).json({ message: e.message });
          return [];
        }),
      )
      .subscribe((products) => {
        res.json(products);
      });
  }

  @ApiTags('Product')
  @ApiOperation({ summary: 'create product' })
  @CreateProductResponse()
  @Post('create-product')
  createProduct(
    @Body() dto: { product: createProductDto; file: Express.Multer.File },
    @Res() res: any,
  ) {
    const createdProduct$ = this.appService.createProduct(
      dto.product,
      dto.file,
    );

    createdProduct$
      .pipe(
        catchError((e) => {
          res.status(400).json({ message: e.message });
          return [];
        }),
      )
      .subscribe((createdProduct) => {
        res.json(createdProduct);
      });
  }

  @ApiTags('Product')
  @ApiOperation({ summary: 'create product type' })
  @CreateProductTypeResponse()
  @Post('create-product-type')
  async createProductType(@Body() type: { name: string }, @Res() res: any) {
    const newType$ = await this.appService.createProductType(type.name);

    newType$
      .pipe(
        catchError((e) => {
          res.status(400).json({ message: e.message });
          return [];
        }),
      )
      .subscribe((newType) => {
        res.json(newType);
      });
  }

  @ApiTags('Product')
  @ApiOperation({ summary: 'delete product' })
  @DeleteProductResponse()
  @Delete('delete-product')
  deleteProduct(@Body() name: string, @Res() res: any) {
    const deletedProduct$ = this.appService.deleteProduct(name);

    deletedProduct$
      .pipe(
        catchError((e) => {
          res.status(400).json({ message: e.message });
          return [];
        }),
      )
      .subscribe((deletedProduct) => {
        res.json(deletedProduct);
      });
  }

  @ApiTags('Product')
  @ApiOperation({ summary: 'delete product type' })
  @DeleteProductTypeResponse()
  @Delete('delete-product-type')
  deleteProductType(@Body() name: string, @Res() res: any) {
    const deletedType$ = this.appService.deleteProductType(name);

    deletedType$
      .pipe(
        catchError((e) => {
          res.status(400).json({ message: e.message });
          return [];
        }),
      )
      .subscribe((deletedType) => {
        res.json(deletedType);
      });
  }
}
