'use client';

import type { Shortcut } from '@/types/shortcut';
import type {
  Lesson,
  ScenarioStep,
  GestureLessonConfig,
  GestureScenarioLessonConfig,
} from '@/types/course';
import InteractiveLesson from './InteractiveLesson';
import ScenarioLesson from './ScenarioLesson';
import MarkdownContent from './MarkdownContent';
import GestureLessonRunner from './GestureLessonRunner';
import GestureScenarioLesson from './GestureScenarioLesson';

interface LessonContentProps {
  lesson: Lesson;
  shortcuts: Shortcut[];
  nextLessonUrl: string | null;
  currentLessonUrl: string;
}

export default function LessonContent({
  lesson,
  shortcuts,
  nextLessonUrl,
  currentLessonUrl,
}: LessonContentProps) {
  // Scenario-based learning
  if (lesson.contentType === 'interactive' && lesson.interactive?.type === 'scenario') {
    const config = lesson.interactive.config as {
      scenarioType?: string;
      steps?: ScenarioStep[];
    };
    if (config.scenarioType && config.steps?.length) {
      return (
        <ScenarioLesson
          lesson={lesson}
          scenarioType={config.scenarioType}
          steps={config.steps}
          shortcuts={shortcuts}
          nextLessonUrl={nextLessonUrl}
        />
      );
    }
  }

  if (lesson.contentType === 'interactive' && lesson.interactive?.type === 'key-press') {
    return (
      <InteractiveLesson
        mode="learn"
        lesson={lesson}
        shortcuts={shortcuts}
        nextLessonUrl={nextLessonUrl}
      />
    );
  }

  if (lesson.contentType === 'practice' && lesson.interactive?.type === 'key-press') {
    return (
      <InteractiveLesson
        mode="practice"
        lesson={lesson}
        shortcuts={shortcuts}
        nextLessonUrl={nextLessonUrl}
      />
    );
  }

  if (lesson.contentType === 'interactive' && lesson.interactive?.type === 'gesture-try') {
    const config = lesson.interactive.config as GestureLessonConfig;
    if (config.questions?.length) {
      return (
        <GestureLessonRunner
          lesson={lesson}
          nextLessonUrl={nextLessonUrl}
          currentLessonUrl={currentLessonUrl}
          questions={config.questions}
          mode="learn"
        />
      );
    }
  }

  if (lesson.contentType === 'interactive' && lesson.interactive?.type === 'gesture-scenario') {
    const config = lesson.interactive.config as GestureScenarioLessonConfig;
    if (config.steps?.length) {
      return (
        <GestureScenarioLesson
          lesson={lesson}
          steps={config.steps}
          nextLessonUrl={nextLessonUrl}
          currentLessonUrl={currentLessonUrl}
          mode="learn"
        />
      );
    }
  }

  if (lesson.contentType === 'quiz') {
    if (lesson.checkpoint?.mode === 'gestures' && lesson.checkpoint.scenarioSteps?.length) {
      return (
        <GestureScenarioLesson
          lesson={lesson}
          steps={lesson.checkpoint.scenarioSteps}
          nextLessonUrl={nextLessonUrl}
          currentLessonUrl={currentLessonUrl}
          mode="quiz"
          passThreshold={lesson.checkpoint.passThreshold}
        />
      );
    }

    if (lesson.checkpoint?.mode === 'gestures' && lesson.checkpoint.questions?.length) {
      return (
        <GestureLessonRunner
          lesson={lesson}
          nextLessonUrl={nextLessonUrl}
          currentLessonUrl={currentLessonUrl}
          questions={lesson.checkpoint.questions}
          mode="quiz"
          passThreshold={lesson.checkpoint.passThreshold}
        />
      );
    }

    return (
      <div className="mb-12 bg-surface border border-border rounded-2xl p-12 text-center">
        <p className="text-[15px] text-ink-secondary font-light">
          测验功能即将推出。请先完成互动练习。
        </p>
      </div>
    );
  }

  return <MarkdownContent content={lesson.content} />;
}
