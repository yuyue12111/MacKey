import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import coursesData from '../../../../../public/data/courses.json';
import type { Course, Chapter, Lesson } from '@/types/course';
import { getShortcutById } from '@/lib/shortcuts';
import ShortcutCard from '@/components/shortcut/ShortcutCard';

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
    .filter(Boolean);

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
      <div className="prose prose-neutral max-w-none mb-12
        prose-headings:font-[var(--font-display)] prose-headings:font-[350] prose-headings:tracking-[-0.01em]
        prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
        prose-p:text-[15px] prose-p:leading-relaxed prose-p:text-ink-secondary prose-p:font-light prose-p:mb-5
        prose-strong:text-ink prose-strong:font-medium
        prose-code:font-mono prose-code:text-sm prose-code:bg-[#F5F3EF] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
        prose-ul:text-ink-secondary prose-li:my-1
        prose-table:bg-surface prose-table:border prose-table:border-border prose-table:rounded-2xl
        prose-th:text-left prose-th:px-4 prose-th:py-3 prose-th:text-[12px] prose-th:font-medium prose-th:text-ink-tertiary
        prose-td:px-4 prose-td:py-3 prose-td:text-[14px] prose-td:text-ink-secondary
        prose-blockquote:border-l-gold prose-blockquote:bg-[#FFF8F0] prose-blockquote:py-3 prose-blockquote:px-5 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-[14px]
      ">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {lesson.content}
        </ReactMarkdown>
      </div>

      {/* ── Related Shortcuts ───────── */}
      {shortcutObjs.length > 0 && (
        <div className="mb-12">
          <h2 className="font-[var(--font-display)] text-lg font-[400] tracking-[-0.01em] mb-4">
            本课涉及的快捷键
          </h2>
          <div className="space-y-3">
            {shortcutObjs.map((s) => (
              <ShortcutCard key={s!.id} shortcut={s!} showComparison />
            ))}
          </div>
        </div>
      )}

      {/* ── Navigation ──────────────── */}
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
    </div>
  );
}
