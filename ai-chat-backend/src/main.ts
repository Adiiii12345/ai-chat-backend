//src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Engedélyezi a frontendnek a csatlakozást
  await app.listen(3000); // A backend a 3000-es porton fut
}
bootstrap();