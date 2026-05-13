import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { getGestureById, getAllGestures } from '@/lib/gestures';

interface Props {
  params: Promise<{ gestureId: string }>;
}

const TYPE_LABELS: Record<string, string> = {
  tap: '轻点', swipe: '滑动', pinch: '捏合',
  rotate: '旋转', scroll: '滚动', 'force-click': '力度点按',
};

export async function generateStaticParams() {
  return getAllGestures().map((g) => ({ gestureId: g.id }));
}

export default async function GestureDetailPage({ params }: Props) {
  const { gestureId } = await params;
  const gesture = getGestureById(gestureId);
  if (!gesture) notFound();

  return (
    <div className="max-w-[800px] mx-auto px-6 py-12">
      <Link
        href="/gestures"
        className="inline-flex items-center gap-1 text-sm text-ink-tertiary hover:text-gold-dim transition-colors no-underline mb-8"
      >
        <ChevronLeft size={16} strokeWidth={1.2} /> 返回手势列表
      </Link>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center gap-0.5">
            {Array.from({ length: gesture.fingerCount }).map((_, i) => (
              <span
                key={i}
                className="w-3 h-3 rounded-full bg-gold-dim/40 inline-block"
              />
            ))}
          </span>
          <span className="text-xs text-ink-tertiary font-medium tracking-[0.04em] uppercase">
            {gesture.fingerCount} 指 · {TYPE_LABELS[gesture.type] || gesture.type}
          </span>
          {gesture.direction && (
            <span className="text-xs text-ink-tertiary">
              · {gesture.direction === 'up' ? '↑' : gesture.direction === 'down' ? '↓' : gesture.direction === 'left' ? '←' : '→'}
            </span>
          )}
        </div>
        <h1 className="font-[var(--font-display)] text-4xl font-[250] tracking-[-0.02em] mb-3">
          {gesture.nameZh}
        </h1>
        <p className="text-[15px] text-ink-secondary font-light leading-relaxed max-w-lg">
          {gesture.descriptionZh}
        </p>
      </div>

      {/* ── Gesture Demo Placeholder ── */}
      <div className="bg-surface border border-border rounded-2xl p-12 mb-8 flex items-center justify-center min-h-[240px]">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-4">
            {Array.from({ length: gesture.fingerCount }).map((_, i) => (
              <span
                key={i}
                className="w-4 h-4 rounded-full bg-gold-dim/30 inline-block"
              />
            ))}
          </div>
          <p className="text-[15px] text-ink-secondary font-light">
            手势动画演示即将上线
          </p>
          <p className="text-[12px] text-ink-tertiary font-light mt-1">
            {gesture.type === 'tap' && '轻点触控板'}
            {gesture.type === 'swipe' && `手指${gesture.direction === 'up' ? '向上' : gesture.direction === 'down' ? '向下' : gesture.direction === 'left' ? '向左' : '向右'}滑动`}
            {gesture.type === 'pinch' && '手指捏合或张开'}
            {gesture.type === 'rotate' && '手指旋转'}
            {gesture.type === 'scroll' && '手指滑动滚动'}
            {gesture.type === 'force-click' && '用力按下触控板'}
          </p>
        </div>
      </div>

      {/* ── Scenarios ────────────────── */}
      {gesture.scenarios.length > 0 && (
        <div className="bg-surface border border-border rounded-2xl p-6">
          <h2 className="font-[var(--font-display)] text-base font-[400] tracking-[-0.01em] mb-3">
            适用场景
          </h2>
          <ul className="space-y-1.5">
            {gesture.scenarios.map((s, i) => (
              <li key={i} className="text-[14px] text-ink-secondary font-light flex items-start gap-2">
                <span className="text-gold-dim mt-0.5">·</span>
                {s}
              </li>
            ))}
          </ul>
          {gesture.windowsEquivalent && (
            <div className="mt-4 pt-4 border-t border-border-light">
              <span className="text-[12px] text-ink-tertiary font-light">
                Windows 等效操作：{gesture.windowsEquivalent}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
