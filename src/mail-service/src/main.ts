import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

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

  // app.useGlobalFilters(new HttpExceptionFilter());
  app.use(
    cookieParser({
      origin: 'http://localhost:4002',
      credentials: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('yArzamata')
    .setDescription('yArzamata duo project')
    .setVersion('1.0')
    .build();

  app.enableCors({
    origin: 'http://localhost:4002',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  });
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, document);

  const port = 4002;

  app.useLogger(logger);

  await app.listen(port, () => logger.log(port));
}

bootstrap();
