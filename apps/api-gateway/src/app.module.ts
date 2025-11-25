import { Module } from '@nestjs/common';
import { LearningController } from './learning/learning.controller';
import { LearningService } from './learning/learning.service';

@Module({
  imports: [],
  controllers: [LearningController],
  providers: [LearningService],
})
export class AppModule {}
