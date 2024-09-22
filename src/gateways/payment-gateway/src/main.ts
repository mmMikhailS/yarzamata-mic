import { NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { HttpExceptionFilter } from './exception/error.exception';
import * as cookieParser from 'cookie-parser';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        return new BadRequestException(
          errors.map((error) => ({
            property: error.property,
            constraints: error.constraints,
          })),
        );
      },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(cookieParser());
  const config = new DocumentBuilder()
    .setTitle('yArzamata')
    .setDescription('yArzamata duo project')
    .setVersion('1.0')
    .build();

  app.enableCors();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, document);
  const port = process.env.PORT || 5003;

  await app.listen(port, () => console.log(port));
}

bootstrap();
