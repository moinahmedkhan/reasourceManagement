import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  providers: [
    {
      provide: 'RABBITMQ_SERVICE',
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://localhost:5672'],
            queue: 'resource_queue',
            queueOptions: {
              durable: false,
            },
          },
        });
      },
    },
  ],
  exports: ['RABBITMQ_SERVICE'],
})
export class RabbitMQModule {}
