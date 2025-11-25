import { Module } from '@nestjs/common';
import { LearningController } from './learning/learning.controller';

@Module({
  imports: [],
  controllers: [LearningController],
  providers: [],
})
export class AppModule {}
