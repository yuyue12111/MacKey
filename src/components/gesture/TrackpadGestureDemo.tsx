'use client';

import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import type { TrackpadGesture } from '@/types/gesture';
import { cn } from '@/lib/cn';

interface TrackpadGestureDemoProps {
  gesture: TrackpadGesture;
  className?: string;
  compact?: boolean;
}

const VIEWBOX = 240;

function pointStyle(x: number, y: number): CSSProperties {
  return {
    left: `${(x / VIEWBOX) * 100}%`,
    top: `${(y / VIEWBOX) * 100}%`,
  };
}

export default function TrackpadGestureDemo({
  gesture,
  className,
  compact,
}: TrackpadGestureDemoProps) {
  const [active, setActive] = useState(false);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    let raf = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const restart = () => {
      setActive(false);
      raf = window.requestAnimationFrame(() => {
        raf = window.requestAnimationFrame(() => {
          setCycle((value) => value + 1);
          setActive(true);
        });
      });
    };

    restart();

    if (gesture.animation.loop) {
      timer = setInterval(restart, gesture.animation.duration + 900);
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (timer) clearInterval(timer);
    };
  }, [gesture]);

  const durationMs = Math.max(gesture.animation.duration, 500);
  const isTapLike = gesture.type === 'tap' || gesture.type === 'force-click';
  const pathData = useMemo(
    () =>
      (gesture.animation.paths ?? []).map((path) =>
        path.points.map((point) => `${point.x},${point.y}`).join(' ')
      ),
    [gesture.animation.paths]
  );

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[28px] border border-border bg-[linear-gradient(180deg,#FDFCF9_0%,#F6F3EE_100%)]',
        compact ? 'min-h-[220px] p-4' : 'min-h-[280px] p-6 md:p-7',
        className
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[radial-gradient(circle_at_top,rgba(212,165,116,0.10),transparent_70%)]" />

      <div className="relative mx-auto aspect-square max-w-[320px]">
        <svg
          viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          <rect
            x="28"
            y="56"
            width="184"
            height="128"
            rx="18"
            fill="rgba(255,255,255,0.76)"
            stroke="rgba(232,230,225,1)"
            strokeWidth="1.5"
          />
          <rect
            x="28"
            y="56"
            width="184"
            height="128"
            rx="18"
            fill="url(#trackpad-glow)"
            opacity="0.8"
          />
          <defs>
            <radialGradient id="trackpad-glow" cx="50%" cy="35%" r="70%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.75)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
          </defs>

          {pathData.map((polyline, index) => (
            <polyline
              key={`${gesture.id}-path-${index}`}
              points={polyline}
              fill="none"
              stroke={gesture.animation.paths?.[index]?.color ?? 'rgba(212,165,116,0.4)'}
              strokeWidth={gesture.animation.paths?.[index]?.width ?? 2}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={active ? 0.95 : 0.32}
            />
          ))}
        </svg>

        {gesture.animation.fingerStart.map((start, index) => {
          const end = gesture.animation.fingerEnd[index] ?? start;
          const translateX = active ? end.x - start.x : 0;
          const translateY = active ? end.y - start.y : 0;
          const compactPress = gesture.type === 'force-click' ? 0.82 : 0.9;

          return (
            <div
              key={`${gesture.id}-${index}-${cycle}`}
              className="absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold-light/80 bg-[linear-gradient(180deg,#FFFDF8_0%,#F5E9D8_100%)] shadow-[0_2px_6px_rgba(212,165,116,0.20)]"
              style={{
                ...pointStyle(start.x, start.y),
                transform: `translate(calc(-50% + ${translateX}px), calc(-50% + ${translateY}px)) scale(${
                  active && isTapLike ? compactPress : 1
                })`,
                transition:
                  `transform ${durationMs}ms cubic-bezier(0.22, 1, 0.36, 1), ` +
                  `box-shadow ${Math.max(220, durationMs / 2)}ms ease`,
                boxShadow:
                  active && isTapLike
                    ? '0 1px 3px rgba(212,165,116,0.18)'
                    : '0 2px 6px rgba(212,165,116,0.20)',
              }}
            />
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-white/70 bg-white/60 px-4 py-3">
        <div>
          <div className="text-[12px] font-medium tracking-[0.04em] text-gold-dim">
            {gesture.nameZh}
          </div>
          <div className="mt-1 text-[12px] font-light text-ink-tertiary">
            {gesture.scenarios[0] ?? '在日常操作中使用'}
          </div>
        </div>
        <div className="shrink-0 rounded-full border border-border bg-white/70 px-3 py-1 text-[11px] font-medium text-ink-secondary">
          {gesture.fingerCount} 指
        </div>
      </div>
    </div>
  );
}
