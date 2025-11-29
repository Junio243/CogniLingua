import { Module } from '@nestjs/common';
import { CurriculumController } from './curriculum/curriculum.controller';
import { LearningController } from './learning/learning.controller';
import { LearningService } from './learning/learning.service';
import { RootController } from './root.controller';
import { SpanishController } from './spanish/spanish.controller';

@Module({
  imports: [],
  controllers: [LearningController, CurriculumController, SpanishController, RootController],
  providers: [LearningService],
})
export class AppModule {}
