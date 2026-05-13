import type { KeyCombination } from './shortcut';

export type QuizQuestionType = 'key-press' | 'multiple-choice' | 'gesture-name';

export interface QuizOption {
  id: string;
  labelZh: string;
}

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  promptZh: string;
  answer: string | KeyCombination;
  options?: QuizOption[];
  relatedShortcutId?: string;
  points: number;
}

export type QuizMode = 'shortcuts' | 'gestures';

export type QuizPhase = 'idle' | 'countdown' | 'asking' | 'feedback' | 'result';

export interface QuizSession {
  id: string;
  mode: QuizMode;
  questions: QuizQuestion[];
  currentIndex: number;
  answers: Record<string, boolean>;
  startTime: number;
  endTime?: number;
  score: number;
  phase: QuizPhase;
}
