import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Creating App
  const app = await NestFactory.create(AppModule);

  // Enabling CORS
  app.enableCors();

  // Validation Pipeline
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // Listening on Port
  await app.listen(process.env['PORT']);
}
bootstrap();
