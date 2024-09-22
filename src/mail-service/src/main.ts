import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exception/error.exception';

async function bootstrap() {
  const logger = new Logger();
  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.TCP,
      options: {
        host: process.env.HOST,
        port: 3002,
      },
    });
  await microservice.listen();
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

  app.enableCors();

  const port = process.env.PORT || 4002;

  app.useLogger(logger);

  await app.listen(port, () => logger.log(port));
}

bootstrap();
