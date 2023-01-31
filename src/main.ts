import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import { json } from 'body-parser';
import * as morgan from 'morgan';
import { NestExpressApplication } from '@nestjs/platform-express';

(async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  app.use(json({ limit: '100mb' }));
  app.set('trust proxy', true);
  app.use(morgan('short'));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nibyou Microservice')
    .setDescription('Microservice Description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  return app.listen(
    process.env.PORT || 3000,
    process.env.ENV === 'prod' ? 'node' : 'localhost',
  );
})();
