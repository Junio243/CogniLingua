import { Module } from '@nestjs/common';
import { CurriculumController } from './curriculum/curriculum.controller';
import { LearningController } from './learning/learning.controller';
import { LearningService } from './learning/learning.service';
import { RootController } from './root.controller';
import { SpanishController } from './spanish/spanish.controller';
import { V1Controller } from './v1.controller';

@Module({
  imports: [],
  controllers: [
    LearningController,
    CurriculumController,
    SpanishController,
    RootController,
    V1Controller,
  ],
  providers: [LearningService],
})
export class AppModule {}
