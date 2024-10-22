import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PORT } from './config/app.environments'
import { HttpExceptionFilter } from './Guards';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }))

  await app.listen(PORT, () => {
    console.log("server listening")
  });
}
bootstrap();
