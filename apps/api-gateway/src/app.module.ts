import { Module } from '@nestjs/common';
import { LearningController } from './learning/learning.controller';
import { CurriculumController } from './curriculum/curriculum.controller';
import { SpanishController } from './spanish/spanish.controller';

@Module({
  imports: [],
  controllers: [LearningController, CurriculumController, SpanishController],
  providers: [],
})
export class AppModule {}
