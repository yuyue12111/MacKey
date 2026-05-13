import type { Difficulty } from './shortcut';

export type ContentType = 'text' | 'interactive' | 'practice' | 'quiz';

export interface CheckpointConfig {
  questionCount: number;
  shortcutPool: string[];
  passThreshold: number;
}

export interface InteractiveConfig {
  type: 'key-press' | 'gesture-try' | 'speed-test';
  config: Record<string, unknown>;
}

export interface Lesson {
  id: string;
  chapterId: string;
  titleZh: string;
  contentType: ContentType;
  content: string;
  shortcutIds: string[];
  interactive?: InteractiveConfig;
  checkpoint?: CheckpointConfig;
  estimatedMinutes: number;
  order: number;
}

export interface Chapter {
  id: string;
  courseId: string;
  titleZh: string;
  descriptionZh: string;
  order: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  slug: string;
  titleZh: string;
  subtitleZh: string;
  descriptionZh: string;
  targetAudience: string;
  estimatedMinutes: number;
  difficulty: Difficulty;
  chapters: Chapter[];
  prerequisiteCourseId?: string;
  order: number;
}
