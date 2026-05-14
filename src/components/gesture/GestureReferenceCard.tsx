import Link from 'next/link';
import type { TrackpadGesture } from '@/types/gesture';
import { getGestureCourseMetaMap, getGestureDirectionLabel, GESTURE_TYPE_LABELS } from '@/lib/gestures';

interface GestureReferenceCardProps {
  gesture: TrackpadGesture;
  href?: string;
  fromLessonUrl?: string;
  compact?: boolean;
}

const courseMetaMap = getGestureCourseMetaMap();

export default function GestureReferenceCard({
  gesture,
  href,
  fromLessonUrl,
  compact,
}: GestureReferenceCardProps) {
  const targetHref = href ?? `/gestures/${gesture.id}${fromLessonUrl ? `?from=${encodeURIComponent(fromLessonUrl)}` : ''}`;
  const coverage = courseMetaMap[gesture.id];
  const directionLabel = getGestureDirectionLabel(gesture.direction);

  return (
    <Link
      href={targetHref}
      className={`group block rounded-2xl border border-border bg-surface no-underline text-inherit transition-all duration-200 hover:border-gold-light hover:shadow-[0_6px_26px_rgba(0,0,0,0.05)] ${
        compact ? 'p-4' : 'p-5'
      }`}
    >
      <div className="mb-3 flex items-center gap-3">
        <span className="flex items-center gap-1">
          {Array.from({ length: gesture.fingerCount }).map((_, index) => (
            <span
              key={`${gesture.id}-finger-${index}`}
              className="inline-block h-2.5 w-2.5 rounded-full bg-gold-dim/30 transition-colors group-hover:bg-gold-dim/50"
            />
          ))}
        </span>
        <span className="text-[11px] font-medium tracking-[0.04em] text-ink-tertiary uppercase">
          {GESTURE_TYPE_LABELS[gesture.type] || gesture.type}
          {directionLabel ? ` · ${directionLabel}` : ''}
        </span>
      </div>

      <div className="mb-1 font-[var(--font-display)] text-base font-[400] tracking-[-0.01em] text-ink">
        {gesture.nameZh}
      </div>
      <p className="text-[12px] font-light leading-relaxed text-ink-tertiary">
        {gesture.descriptionZh}
      </p>

      {coverage && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-border bg-[#FAFAF8] px-2.5 py-1 text-[10px] font-medium text-ink-secondary">
            {coverage.chapterTitleZh}
          </span>
          {coverage.recommendedForBeginners && (
            <span className="rounded-full border border-gold-light/70 bg-[#FFF8F0] px-2.5 py-1 text-[10px] font-medium text-gold-dim">
              推荐先学
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
