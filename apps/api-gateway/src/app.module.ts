import { Module } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurriculumController } from './curriculum/curriculum.controller';
import { LearningController } from './learning/learning.controller';
import { LearningService } from './learning/learning.service';
import { RootController } from './root.controller';
import { SpanishController } from './spanish/spanish.controller';
import { V1Controller } from './v1.controller';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { HttpModule } from '@nestjs/axios';
import { LessonEventEntity } from './learning/entities/lesson-event.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DATABASE_PATH || 'cognilingua.db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([LessonEventEntity]),
    HttpModule.register({
      timeout: Number(process.env.LEARNING_HTTP_TIMEOUT_MS ?? 5000),
      maxRedirects: 0,
    }),
    AuthModule,
  ],
  controllers: [
    LearningController,
    CurriculumController,
    SpanishController,
    RootController,
    V1Controller,
  ],
  providers: [
    LearningService,
    Reflector,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
