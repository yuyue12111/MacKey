import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TrackpadGestureDemo from '@/components/gesture/TrackpadGestureDemo';
import GestureReferenceCard from '@/components/gesture/GestureReferenceCard';
import {
  getGestureById,
  getAllGestures,
  getGestureCourseMetaMap,
  getGestureDirectionLabel,
  GESTURE_TYPE_LABELS,
} from '@/lib/gestures';

interface Props {
  params: Promise<{ gestureId: string }>;
  searchParams?: Promise<{ from?: string }>;
}

const GESTURE_MISTAKES: Record<string, string[]> = {
  'two-finger-scroll': ['刚接触 Mac 时最容易和 Windows 的滚动方向混淆。建议先接受“自然滚动”的心智：手指像在推动内容。'],
  'two-finger-scroll-h': ['如果页面本身不支持水平滚动，这个手势看起来像“没反应”，并不是你做错了。'],
  'pinch-zoom': ['和智能缩放不同，双指捏合是连续缩放；智能缩放是系统帮你跳到一个合适比例。'],
  'smart-zoom': ['智能缩放不是所有应用都支持，最常见于 Safari 和预览。'],
  'three-finger-mission-control': ['Mission Control 是“看所有窗口”，不要和“应用 Exposé”混在一起。'],
  'three-finger-app-expose': ['应用 Exposé 只看当前应用的所有窗口，不会把其他应用一起带出来。'],
  'three-finger-switch-desktop': ['这个手势最适合已经建立多桌面习惯的用户，否则容易忘记自己切到了哪个空间。'],
  'two-finger-swipe-page': ['这个手势依赖应用支持；在浏览器里最常见，在普通窗口里并不一定生效。'],
  'two-finger-notification': ['它是从右侧边缘向左滑入，不是普通的双指左滑。'],
  'force-click': ['Force Click 需要支持力度触控的设备，并且要“比普通点击更用力”，但不是长按。'],
};

export async function generateStaticParams() {
  return getAllGestures().map((gesture) => ({ gestureId: gesture.id }));
}

export default async function GestureDetailPage({ params, searchParams }: Props) {
  const { gestureId } = await params;
  const resolvedSearch = searchParams ? await searchParams : {};
  const gesture = getGestureById(gestureId);
  if (!gesture) notFound();

  const courseMetaMap = getGestureCourseMetaMap();
  const coverage = courseMetaMap[gesture.id];
  const relatedGestures = getAllGestures()
    .filter((item) => item.id !== gesture.id)
    .filter(
      (item) =>
        item.fingerCount === gesture.fingerCount ||
        item.type === gesture.type ||
        item.direction === gesture.direction
    )
    .slice(0, 3);

  const fromLessonUrl = resolvedSearch.from ? decodeURIComponent(resolvedSearch.from) : null;
  const directionLabel = getGestureDirectionLabel(gesture.direction);
  const mistakes = GESTURE_MISTAKES[gesture.id] ?? ['先记动作用途，再记指法；如果只背名字，很容易和其他多指手势混在一起。'];

  return (
    <div className="max-w-[880px] mx-auto px-6 py-12">
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <Link
          href="/gestures"
          className="inline-flex items-center gap-1 text-sm text-ink-tertiary hover:text-gold-dim transition-colors no-underline"
        >
          <ChevronLeft size={16} strokeWidth={1.2} /> 返回手势列表
        </Link>

        {fromLessonUrl && (
          <Link
            href={fromLessonUrl}
            className="inline-flex items-center gap-1 text-sm text-gold-dim hover:text-gold transition-colors no-underline"
          >
            <ChevronLeft size={16} strokeWidth={1.2} /> 返回刚才的课程
          </Link>
        )}
      </div>

      <div className="mb-10">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="flex items-center gap-1">
            {Array.from({ length: gesture.fingerCount }).map((_, index) => (
              <span
                key={`${gesture.id}-finger-${index}`}
                className="w-3 h-3 rounded-full bg-gold-dim/40 inline-block"
              />
            ))}
          </span>
          <span className="text-xs text-ink-tertiary font-medium tracking-[0.04em] uppercase">
            {gesture.fingerCount} 指 · {GESTURE_TYPE_LABELS[gesture.type] || gesture.type}
          </span>
          {directionLabel && (
            <span className="text-xs text-ink-tertiary">· {directionLabel}</span>
          )}
          {coverage && (
            <span className="rounded-full border border-gold-light/70 bg-[#FFF8F0] px-2.5 py-1 text-[11px] font-medium text-gold-dim">
              收录于 {coverage.chapterTitleZh}
            </span>
          )}
        </div>

        <h1 className="font-[var(--font-display)] text-4xl font-[250] tracking-[-0.02em] mb-3">
          {gesture.nameZh}
        </h1>
        <p className="text-[15px] text-ink-secondary font-light leading-relaxed max-w-2xl">
          {gesture.descriptionZh}
        </p>
      </div>

      <TrackpadGestureDemo gesture={gesture} className="mb-8" />

      <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="font-[var(--font-display)] text-base font-[400] tracking-[-0.01em] mb-3">
              适用场景
            </h2>
            <ul className="space-y-2">
              {gesture.scenarios.map((scenario, index) => (
                <li key={`${gesture.id}-scenario-${index}`} className="text-[14px] text-ink-secondary font-light flex items-start gap-2">
                  <span className="text-gold-dim mt-0.5">·</span>
                  {scenario}
                </li>
              ))}
            </ul>
            {gesture.windowsEquivalent && (
              <div className="mt-4 pt-4 border-t border-border-light text-[12px] text-ink-tertiary font-light">
                Windows 等效操作：{gesture.windowsEquivalent}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="font-[var(--font-display)] text-base font-[400] tracking-[-0.01em] mb-3">
              常见误区
            </h2>
            <ul className="space-y-2">
              {mistakes.map((item, index) => (
                <li key={`${gesture.id}-mistake-${index}`} className="text-[14px] text-ink-secondary font-light flex items-start gap-2">
                  <span className="text-gold-dim mt-0.5">·</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          {coverage && (
            <div className="rounded-2xl border border-border bg-surface p-6">
              <div className="text-[12px] font-medium tracking-[0.04em] text-gold-dim mb-2">
                对应课程入口
              </div>
              <div className="font-[var(--font-display)] text-xl font-[350] tracking-[-0.01em] text-ink">
                {coverage.lessonTitleZh}
              </div>
              <div className="mt-2 text-[13px] font-light leading-relaxed text-ink-tertiary">
                从课程里继续看这个手势是怎么被讲解、怎么被测验的。
              </div>
              <div className="mt-5 space-y-3">
                <Link
                  href={`/courses/${coverage.courseSlug}/${coverage.lessonId}`}
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gold-dim no-underline transition-colors hover:text-gold"
                >
                  去这节课复习 <ChevronRight size={14} strokeWidth={1.4} />
                </Link>
                {fromLessonUrl && (
                  <div>
                    <Link
                      href={fromLessonUrl}
                      className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-secondary no-underline transition-colors hover:text-gold-dim"
                    >
                      回到刚才的练习 <ChevronRight size={14} strokeWidth={1.4} />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="font-[var(--font-display)] text-base font-[400] tracking-[-0.01em] mb-4">
              容易混淆的相关手势
            </h2>
            <div className="space-y-3">
              {relatedGestures.map((relatedGesture) => (
                <GestureReferenceCard
                  key={relatedGesture.id}
                  gesture={relatedGesture}
                  compact
                  fromLessonUrl={fromLessonUrl ?? undefined}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
