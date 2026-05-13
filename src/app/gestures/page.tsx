import Link from 'next/link';
import { getAllGestures } from '@/lib/gestures';
import { Hand } from 'lucide-react';

const GESTURE_TYPE_LABELS: Record<string, string> = {
  tap: '轻点', swipe: '滑动', pinch: '捏合',
  rotate: '旋转', scroll: '滚动', 'force-click': '力度点按',
};

export default function GesturesPage() {
  const gestures = getAllGestures();

  return (
    <div className="max-w-[1040px] mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="font-[var(--font-display)] text-4xl font-[250] tracking-[-0.02em] mb-3">
          触控板手势
        </h1>
        <p className="text-[15px] text-ink-secondary font-light max-w-lg">
          Mac 的触控板远不止点击和滚动。掌握这些手势，告别鼠标。
        </p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {gestures.map((g) => (
          <Link
            key={g.id}
            href={`/gestures/${g.id}`}
            className="group block bg-surface border border-border rounded-2xl p-6 hover:border-gold-light hover:shadow-[0_4px_24px_rgba(0,0,0,0.05)] transition-all duration-200 no-underline text-inherit -translate-y-0.5 hover:-translate-y-0"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="flex items-center gap-0.5">
                {Array.from({ length: g.fingerCount }).map((_, i) => (
                  <span
                    key={i}
                    className="w-2.5 h-2.5 rounded-full bg-gold-dim/30 group-hover:bg-gold-dim/50 transition-colors inline-block"
                  />
                ))}
              </span>
              <span className="text-[11px] text-ink-tertiary font-medium tracking-[0.04em] uppercase">
                {GESTURE_TYPE_LABELS[g.type] || g.type}
              </span>
            </div>
            <h3 className="font-[var(--font-display)] text-base font-[400] tracking-[-0.01em] mb-1.5">
              {g.nameZh}
            </h3>
            <p className="text-[12px] text-ink-tertiary font-light leading-relaxed">
              {g.descriptionZh}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
