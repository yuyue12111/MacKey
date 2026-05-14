import type { Difficulty } from './shortcut';
import type { QuizMode } from './quiz';
import type {
  Direction,
  FingerCount,
  GestureEdgeZone,
  GesturePinchKind,
  GestureRotationDirection,
  GestureSimulationMode,
} from './gesture';

export type ContentType = 'text' | 'interactive' | 'practice' | 'quiz';
export type ScenarioType = 'text-editor' | 'desktop' | 'finder' | 'screenshot';
export type GesturePromptMode = 'animation' | 'scenario';
export type GestureScenarioType = 'browser' | 'desktop' | 'preview' | 'system';

export interface CheckpointConfig {
  questionCount: number;
  shortcutPool: string[];
  passThreshold: number;
  mode?: QuizMode;
  gestureIds?: string[];
  questions?: GestureQuestion[];
  scenarioSteps?: GestureSimulationStep[];
}

export interface ScenarioStep {
  prompt: string;
  targetShortcutId: string;
  feedback: string;
}

export interface GestureQuestion {
  id: string;
  promptZh: string;
  gestureId: string;
  optionGestureIds: string[];
  explanationZh: string;
  promptMode: GesturePromptMode;
  scenarioZh?: string;
  reviewGestureId?: string;
}

export interface GestureLessonConfig {
  introZh?: string;
  questions: GestureQuestion[];
}

export interface AcceptedGesture {
  gestureId: string;
  fingerCount: FingerCount;
  mode: GestureSimulationMode;
  direction?: Direction;
  edge?: Exclude<GestureEdgeZone, 'none'>;
  tapCount?: 1 | 2;
  pinchKind?: GesturePinchKind;
  rotationDirection?: GestureRotationDirection;
  minDistance?: number;
}

export interface GestureErrorHint {
  fingerCountZh?: string;
  modeZh?: string;
  directionZh?: string;
  edgeZh?: string;
  tapCountZh?: string;
  pinchKindZh?: string;
  rotationZh?: string;
  fallbackZh?: string;
}

export interface GestureSimulationStep {
  id: string;
  promptZh: string;
  sceneTitleZh: string;
  scenarioType: GestureScenarioType;
  gestureIds: string[];
  acceptedGesture: AcceptedGesture;
  successFeedbackZh: string;
  successVisualState: string;
  followupCopyZh?: string;
  sceneDescriptionZh?: string;
  errorHints?: GestureErrorHint;
  reviewGestureId?: string;
}

export interface GestureScenarioLessonConfig {
  introZh?: string;
  reviewTitleZh?: string;
  reviewContent?: string;
  steps: GestureSimulationStep[];
}

export interface InteractiveConfig {
  type: 'key-press' | 'scenario' | 'gesture-try' | 'gesture-scenario' | 'speed-test';
  config: Record<string, unknown> | GestureLessonConfig | GestureScenarioLessonConfig;
}

export interface Lesson {
  id: string;
  chapterId: string;
  titleZh: string;
  contentType: ContentType;
  content: string;
  shortcutIds: string[];
  gestureIds?: string[];
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
