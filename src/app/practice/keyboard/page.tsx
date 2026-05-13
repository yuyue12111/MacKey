'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import coursesData from '../../../../public/data/courses.json';
import type { Course, Lesson, ScenarioStep } from '@/types/course';
import type { Shortcut } from '@/types/shortcut';
import { getShortcutById } from '@/lib/shortcuts';
import ScenarioLesson from '@/components/lesson/ScenarioLesson';

interface ScenarioLessonData {
  lesson: Lesson;
  scenarioType: string;
  steps: ScenarioStep[];
  shortcuts: Shortcut[];
  titleZh: string;
}

function collectScenarioLessons(): ScenarioLessonData[] {
  const courses = coursesData as Course[];
  const result: ScenarioLessonData[] = [];

  for (const course of courses) {
    for (const ch of course.chapters) {
      for (const l of ch.lessons) {
        if (
          l.contentType === 'interactive' &&
          l.interactive?.type === 'scenario'
        ) {
          const config = l.interactive.config as {
            scenarioType?: string;
            steps?: ScenarioStep[];
          };
          if (config.scenarioType && config.steps?.length) {
            const shortcuts = l.shortcutIds
              .map((id) => getShortcutById(id))
              .filter(Boolean) as Shortcut[];
            result.push({
              lesson: l,
              scenarioType: config.scenarioType,
              steps: config.steps,
              shortcuts,
              titleZh: l.titleZh,
            });
          }
        }
      }
    }
  }

  return result;
}

const ALL_LESSONS = collectScenarioLessons();

export default function KeyboardPracticePage() {
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);

  const currentLesson = ALL_LESSONS[currentLessonIdx];
  const isLast = currentLessonIdx >= ALL_LESSONS.length - 1;

  const handleNextLesson = () => {
    if (!isLast) {
      setCurrentLessonIdx((prev) => prev + 1);
    }
  };

  if (!currentLesson && ALL_LESSONS.length === 0) {
    return (
      <div className="max-w-[800px] mx-auto px-6 py-24 text-center">
        <p className="text-ink-tertiary font-light">暂无练习内容</p>
        <Link href="/courses" className="text-gold-dim text-sm mt-4 inline-block">
          返回选择
        </Link>
      </div>
    );
  }

  if (currentLessonIdx >= ALL_LESSONS.length) {
    return (
      <div className="max-w-[800px] mx-auto px-6 py-24 text-center">
        <h2 className="font-[var(--font-display)] text-3xl font-[250] mb-4">全部完成！</h2>
        <p className="text-ink-secondary font-light mb-8">
          你已经完成了所有 {ALL_LESSONS.length} 个键盘练习
        </p>
        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 bg-ink text-white px-6 py-2.5 rounded-full text-[14px] font-medium hover:bg-[#333] transition-colors no-underline"
        >
          <ChevronLeft size={16} strokeWidth={1.5} />
          返回选择
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto px-6 py-8">
      {/* Top bar: back + progress */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/courses"
          className="inline-flex items-center gap-1 text-[13px] text-ink-tertiary hover:text-gold-dim transition-colors no-underline"
        >
          <ChevronLeft size={16} strokeWidth={1.2} />
          退出
        </Link>
        <span className="text-[12px] text-ink-tertiary font-light">
          {currentLessonIdx + 1} / {ALL_LESSONS.length}
        </span>
      </div>

      {/* Category transition */}
      {currentLessonIdx > 0 && (
        <div className="bg-[#FFF8F0] border border-gold-light/50 rounded-xl px-4 py-2.5 text-center mb-6 animate-in fade-in duration-300">
          <p className="text-[13px] text-gold-dim font-light">
            ✅ 上一个完成 · 接下来：
            <span className="font-medium ml-1">{currentLesson?.titleZh}</span>
          </p>
        </div>
      )}

      <ScenarioLesson
        key={currentLessonIdx}
        lesson={currentLesson.lesson}
        scenarioType={currentLesson.scenarioType}
        steps={currentLesson.steps}
        shortcuts={currentLesson.shortcuts}
        nextLessonUrl={null}
        streamlined
        onComplete={isLast ? undefined : handleNextLesson}
      />
    </div>
  );
}
