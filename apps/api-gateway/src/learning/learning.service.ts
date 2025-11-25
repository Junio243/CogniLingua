import { Injectable } from '@nestjs/common';
import {
  LearningModule,
  MODULE_SEQUENCE,
  ModuleCompletionCriteria,
  ModuleItem,
} from '@cognilingua/shared';
import { NextItemRequestDto } from './dto/next-item-request.dto';

export interface ModuleProgressState {
  moduleId: string;
  completedItemIds: string[];
  remainingItemIds: string[];
  totalItems: number;
  completionPercent: number;
  accuracyPercent: number;
  exercisesCompleted: number;
  meetsCompletionCriteria: boolean;
  completionCriteria: ModuleCompletionCriteria;
}

export interface NextItemResponse {
  studentId: string;
  currentModule: LearningModule;
  progress: ModuleProgressState;
  nextItem: ModuleItem | null;
  moduleCompleted: boolean;
  nextModuleSuggestion: LearningModule | null;
}

@Injectable()
export class LearningService {
  private readonly modules = [...MODULE_SEQUENCE].sort((a, b) => a.order - b.order);

  getModules(): LearningModule[] {
    return this.modules;
  }

  getNextItem(dto: NextItemRequestDto): NextItemResponse {
    const activeModule = this.resolveModule(dto.moduleId);
    const sanitizedCompletedIds = this.filterCompletedItems(
      activeModule,
      dto.completedItemIds,
    );

    const progress = this.buildProgress(
      activeModule,
      sanitizedCompletedIds,
      dto.accuracyPercent,
      dto.exercisesCompleted,
    );

    const nextItem = progress.meetsCompletionCriteria
      ? null
      : this.getNextVocabularyItem(activeModule, progress.completedItemIds);

    return {
      studentId: dto.studentId,
      currentModule: activeModule,
      progress,
      nextItem,
      moduleCompleted: progress.meetsCompletionCriteria,
      nextModuleSuggestion: this.getNextModule(activeModule.id) ?? null,
    };
  }

  private resolveModule(moduleId?: string): LearningModule {
    if (moduleId) {
      const found = this.modules.find((module) => module.id === moduleId);
      if (found) {
        return found;
      }
    }

    return this.modules[0];
  }

  private getNextModule(currentModuleId: string): LearningModule | undefined {
    const currentIndex = this.modules.findIndex((module) => module.id === currentModuleId);
    if (currentIndex === -1) {
      return undefined;
    }

    return this.modules[currentIndex + 1];
  }

  private filterCompletedItems(
    module: LearningModule,
    completedItemIds?: string[],
  ): string[] {
    if (!completedItemIds || !completedItemIds.length) {
      return [];
    }

    const vocabularyIds = new Set(module.vocabulary.map((item) => item.id));
    return completedItemIds.filter((id) => vocabularyIds.has(id));
  }

  private buildProgress(
    module: LearningModule,
    completedItemIds: string[],
    accuracyPercent = 0,
    exercisesCompleted = 0,
  ): ModuleProgressState {
    const totalItems = module.vocabulary.length;
    const uniqueCompleted = Array.from(new Set(completedItemIds));

    const remainingIds = module.vocabulary
      .filter((item) => !uniqueCompleted.includes(item.id))
      .map((item) => item.id);

    const completionPercent = Number(
      ((uniqueCompleted.length / Math.max(totalItems, 1)) * 100).toFixed(1),
    );

    const meetsCompletionCriteria = this.evaluateCompletion(
      module.completionCriteria,
      uniqueCompleted.length,
      accuracyPercent,
      exercisesCompleted,
    );

    return {
      moduleId: module.id,
      completedItemIds: uniqueCompleted,
      remainingItemIds: remainingIds,
      totalItems,
      completionPercent,
      accuracyPercent,
      exercisesCompleted,
      meetsCompletionCriteria,
      completionCriteria: module.completionCriteria,
    };
  }

  private evaluateCompletion(
    criteria: ModuleCompletionCriteria,
    learnedCount: number,
    accuracyPercent: number,
    exercisesCompleted: number,
  ): boolean {
    const hasVocabulary = learnedCount >= criteria.minVocabulary;
    const meetsAccuracy = accuracyPercent >= criteria.minAccuracyPercent;
    const meetsExercises = exercisesCompleted >= criteria.minExercises;

    return hasVocabulary && meetsAccuracy && meetsExercises;
  }

  private getNextVocabularyItem(
    module: LearningModule,
    completedItemIds: string[],
  ): ModuleItem | null {
    const completedSet = new Set(completedItemIds);
    return module.vocabulary.find((item) => !completedSet.has(item.id)) ?? null;
  }
}
