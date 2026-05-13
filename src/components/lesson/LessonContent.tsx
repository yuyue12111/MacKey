'use client';

import type { Shortcut } from '@/types/shortcut';
import type { Lesson, ScenarioStep } from '@/types/course';
import InteractiveLesson from './InteractiveLesson';
import ScenarioLesson from './ScenarioLesson';
import MarkdownContent from './MarkdownContent';

interface LessonContentProps {
  lesson: Lesson;
  shortcuts: Shortcut[];
  nextLessonUrl: string | null;
}

export default function LessonContent({ lesson, shortcuts, nextLessonUrl }: LessonContentProps) {
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

  if (lesson.contentType === 'quiz') {
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
