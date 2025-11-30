import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DATABASE_PATH || 'cognilingua.db',
      autoLoadEntities: true,
      synchronize: true,
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
