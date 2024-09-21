import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function CreateBrandProductResponse() {
  return applyDecorators(
    ApiResponse({
      status: 201,
      description: 'Тип успешно создан',
    }),
  );
}
