import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import GestureReferenceCard from '@/components/gesture/GestureReferenceCard';
import { getAllGestures, getGestureCourseMetaMap, getTrackpadCourse } from '@/lib/gestures';

export default function GesturesPage() {
  const gestures = getAllGestures();
  const course = getTrackpadCourse();
  const courseMetaMap = getGestureCourseMetaMap();

  return (
    <div className="max-w-[1040px] mx-auto px-6 py-12">
      <div className="mb-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-[var(--font-display)] text-4xl font-[250] tracking-[-0.02em] mb-3">
            触控板手势
          </h1>
          <p className="text-[15px] text-ink-secondary font-light max-w-xl leading-relaxed">
            这里不仅是手势目录，也是课程外的复习入口。先看动画，再回到课程里练，或者直接从这里挑一个手势查清楚。
          </p>
        </div>

        {course && (
          <Link
            href={`/courses/${course.slug}/${course.chapters[0]?.lessons[0]?.id}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-gold-light/70 bg-[#FFF8F0] px-4 py-2.5 text-[13px] font-medium text-gold-dim no-underline transition-colors hover:text-gold"
          >
            从课程开始系统学习 <ArrowRight size={15} strokeWidth={1.4} />
          </Link>
        )}
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {gestures.map((gesture) => {
          const coverage = courseMetaMap[gesture.id];

          return (
            <div key={gesture.id} className="space-y-2">
              <GestureReferenceCard gesture={gesture} />
              {coverage && (
                <div className="px-1 flex items-center justify-between gap-3 text-[11px] font-light text-ink-tertiary">
                  <span>收录于：{coverage.chapterTitleZh}</span>
                  <Link
                    href={`/courses/${coverage.courseSlug}/${coverage.lessonId}`}
                    className="text-gold-dim no-underline hover:text-gold transition-colors font-medium"
                  >
                    去课程
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
