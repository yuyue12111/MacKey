import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import coursesData from '../../../../../public/data/courses.json';
import type { Course, Chapter, Lesson } from '@/types/course';
import type { Shortcut } from '@/types/shortcut';
import { getShortcutById } from '@/lib/shortcuts';
import ShortcutCard from '@/components/shortcut/ShortcutCard';
import LessonContent from '@/components/lesson/LessonContent';
import MarkdownContent from '@/components/lesson/MarkdownContent';

const courses = coursesData as Course[];

interface Props {
  params: Promise<{ courseId: string; lessonId: string }>;
}

function findLesson(courseId: string, lessonId: string): {
  course: Course;
  chapter: Chapter;
  lesson: Lesson;
  prevLesson: { courseId: string; lessonId: string } | null;
  nextLesson: { courseId: string; lessonId: string } | null;
} | null {
  const course = courses.find((c) => c.slug === courseId);
  if (!course) return null;

  const allLessons: { chapter: Chapter; lesson: Lesson }[] = [];
  for (const ch of course.chapters) {
    for (const l of ch.lessons) {
      allLessons.push({ chapter: ch, lesson: l });
    }
  }

  const idx = allLessons.findIndex(({ lesson }) => lesson.id === lessonId);
  if (idx === -1) return null;

  const { chapter, lesson } = allLessons[idx];
  const prev = idx > 0 ? {
    courseId: course.slug,
    lessonId: allLessons[idx - 1].lesson.id,
  } : null;
  const next = idx < allLessons.length - 1 ? {
    courseId: course.slug,
    lessonId: allLessons[idx + 1].lesson.id,
  } : null;

  return { course, chapter, lesson, prevLesson: prev, nextLesson: next };
}

export default async function LessonPage({ params }: Props) {
  const { courseId, lessonId } = await params;
  const result = findLesson(courseId, lessonId);
  if (!result) notFound();

  const { course, chapter, lesson, prevLesson, nextLesson } = result;
  const shortcutObjs = lesson.shortcutIds
    .map((id) => getShortcutById(id))
    .filter(Boolean) as Shortcut[];
  const isInteractive = lesson.contentType === 'interactive' || lesson.contentType === 'practice';

  return (
    <div className="max-w-[800px] mx-auto px-6 py-12">
      {/* ── Breadcrumb ──────────────── */}
      <div className="flex items-center gap-2 text-[13px] text-ink-tertiary font-light mb-8 flex-wrap">
        <Link href="/courses" className="hover:text-gold-dim transition-colors no-underline">
          {course.titleZh}
        </Link>
        <span>/</span>
        <span>{chapter.titleZh}</span>
        <span>/</span>
        <span className="text-ink-secondary">{lesson.titleZh}</span>
      </div>

      {/* ── Lesson Title ────────────── */}
      <h1 className="font-[var(--font-display)] text-3xl font-[300] tracking-[-0.02em] mb-2">
        {lesson.titleZh}
      </h1>
      <p className="text-[14px] text-ink-tertiary font-light mb-10">
        第{chapter.order}章 · {lesson.estimatedMinutes} 分钟
      </p>

      {/* ── Lesson Content ──────────── */}
      {isInteractive ? (
        <div className="mb-12">
          <LessonContent
            lesson={lesson}
            shortcuts={shortcutObjs}
            nextLessonUrl={nextLesson ? `/courses/${nextLesson.courseId}/${nextLesson.lessonId}` : null}
          />
        </div>
      ) : lesson.contentType === 'quiz' ? (
        <div className="mb-12 bg-surface border border-border rounded-2xl p-12 text-center">
          <p className="text-[15px] text-ink-secondary font-light">
            测验功能即将推出。请先完成互动练习。
          </p>
        </div>
      ) : (
        <>
          <MarkdownContent content={lesson.content} />

          {shortcutObjs.length > 0 && (
            <div className="mb-12">
              <h2 className="font-[var(--font-display)] text-lg font-[400] tracking-[-0.01em] mb-4">
                本课涉及的快捷键
              </h2>
              <div className="space-y-3">
                {shortcutObjs.map((s) => (
                  <ShortcutCard key={s.id} shortcut={s} showComparison />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Navigation ──────────────── */}
      {!isInteractive && (
        <div className="flex items-center justify-between pt-8 border-t border-border-light">
          {prevLesson ? (
            <Link
              href={`/courses/${prevLesson.courseId}/${prevLesson.lessonId}`}
              className="inline-flex items-center gap-1 text-sm text-ink-tertiary hover:text-gold-dim transition-colors no-underline"
            >
              <ChevronLeft size={16} strokeWidth={1.2} /> 上一课
            </Link>
          ) : (
            <div />
          )}
          {nextLesson && (
            <Link
              href={`/courses/${nextLesson.courseId}/${nextLesson.lessonId}`}
              className="inline-flex items-center gap-1 text-sm text-gold-dim hover:text-gold transition-colors no-underline font-medium"
            >
              下一课 <ChevronRight size={16} strokeWidth={1.2} />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
