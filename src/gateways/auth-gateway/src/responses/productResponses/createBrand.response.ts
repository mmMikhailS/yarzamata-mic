import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function CreateProductBrandResponse() {
  return applyDecorators(
    ApiResponse({
      status: 201,
      description: 'Брэнд успешно создан',
    }),
  );
}
