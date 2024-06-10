import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  process.on('uncaughtException', (err) => {
    console.error('\x1b[31m%s\x1b[0m', 'UNCAUGHT EXCEPTION!');
    console.error('\x1b[31m%s\x1b[0m', err);
  });

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
