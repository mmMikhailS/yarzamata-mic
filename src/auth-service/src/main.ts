import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const logger = new Logger('Main');
  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.TCP,
      options: {
        host: process.env.HOST,
        port: 3001,
      },
    });

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      // Можно добавить кастомное сообщение об ошибке
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
  app.use(cookieParser());
  app.useLogger(logger);

  const port = process.env.PORT || 4001;

  await app.listen(port, () => logger.log(port));
  await microservice.listen();
}

bootstrap();
