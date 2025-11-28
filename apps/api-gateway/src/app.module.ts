import { Module } from '@nestjs/common';
import { LearningController } from './learning/learning.controller';
import { CurriculumController } from './curriculum/curriculum.controller';
import { SpanishController } from './spanish/spanish.controller';
import { LearningService } from './learning/learning.service';

@Module({
  imports: [],
  controllers: [LearningController, CurriculumController, SpanishController],
  providers: [LearningService],
})
export class AppModule {}