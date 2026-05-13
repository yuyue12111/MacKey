import Link from 'next/link';
import { Clock, BookOpen, ChevronRight } from 'lucide-react';
import coursesData from '../../../public/data/courses.json';
import type { Course } from '@/types/course';

const courses = coursesData as Course[];

const DIFFICULTY_LABELS: Record<string, string> = {
  basic: '基础',
  intermediate: '进阶',
  advanced: '高级',
};

export default function CoursesPage() {
  return (
    <div className="max-w-[1040px] mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="font-[var(--font-display)] text-4xl font-[250] tracking-[-0.02em] mb-3">
          macOS 键盘课程
        </h1>
        <p className="text-[15px] text-ink-secondary font-light max-w-lg">
          从入门到精通，按自己的节奏逐步掌握 Mac 的所有操作
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.slug}/${course.chapters[0]?.lessons[0]?.id || ''}`}
            className="group block bg-surface border border-border rounded-2xl p-8 hover:border-gold-light hover:shadow-[0_4px_24px_rgba(0,0,0,0.05)] transition-all duration-200 no-underline text-inherit -translate-y-0.5 hover:-translate-y-0"
          >
            <h3 className="font-[var(--font-display)] text-xl font-[400] tracking-[-0.01em] mb-1.5">
              {course.titleZh}
            </h3>
            <p className="text-[13px] text-ink-secondary font-light mb-4">
              {course.subtitleZh}
            </p>
            <p className="text-[13px] text-ink-secondary font-light leading-relaxed mb-5">
              {course.descriptionZh}
            </p>

            <div className="flex flex-wrap gap-4 text-[12px] text-ink-tertiary font-normal mb-4">
              <span className="flex items-center gap-1">
                <BookOpen size={13} strokeWidth={1.2} />
                {course.chapters.length} 章节
              </span>
              <span className="flex items-center gap-1">
                <Clock size={13} strokeWidth={1.2} />
                {course.estimatedMinutes} 分钟
              </span>
              <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium text-[11px]">
                {DIFFICULTY_LABELS[course.difficulty]}
              </span>
            </div>

            <div className="flex items-center gap-1 text-gold-dim text-[13px] font-medium">
              开始学习 <ChevronRight size={14} strokeWidth={1.5} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
