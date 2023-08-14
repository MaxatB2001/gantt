import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';


async function bootstrap() {

  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_ADDRESS],
      queue: 'query_to_listen_name',
      queueOptions: {
        durable: false
      },
    },
  })

  app.listen()
}
bootstrap();