
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZeebeServer } from 'nestjs-zeebe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
  .addBearerAuth({    type: 'http',
                      scheme: 'bearer',
                      bearerFormat: 'JWT'})
  .setTitle('Заголовок')
  .setDescription('Описание документации')
  .setVersion('1.0')
  .addTag('Тег')
  .build()
  
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup(`${process.env.SERVICE_NAME}-swagger`, app, document);
  const microservice = app.connectMicroservice({
    strategy: app.get(ZeebeServer),
  });
  app.enableCors({allowedHeaders:'*'})
  await app.startAllMicroservices();
  await app.listen(process.env.SERVER_PORT);
}
bootstrap();