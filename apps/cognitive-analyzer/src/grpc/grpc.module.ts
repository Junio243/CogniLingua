import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { GrpcProducerService } from './grpc-producer.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'COGNITIVE_ANALYZER_GRPC_CLIENT',
        transport: Transport.GRPC,
        options: {
          url: process.env.COGNITIVE_ANALYZER_GRPC_TARGET || 'localhost:50061',
          package: 'cognitive.analyzer',
          protoPath: join(__dirname, '../proto/cognitive-analyzer.proto'),
        },
      },
    ]),
  ],
  providers: [GrpcProducerService],
  exports: [GrpcProducerService, ClientsModule],
})
export class GrpcModule {}
