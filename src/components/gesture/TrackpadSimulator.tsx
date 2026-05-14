'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import type {
  FingerCount,
  GesturePinchKind,
  GestureRotationDirection,
  GestureSimulationInput,
  GestureSimulationMode,
  Point,
} from '@/types/gesture';
import type { AcceptedGesture } from '@/types/course';

interface TrackpadSimulatorProps {
  acceptedGesture: AcceptedGesture;
  disabled?: boolean;
  onSimulate: (input: GestureSimulationInput) => void;
}

const FINGER_OPTIONS: FingerCount[] = [1, 2, 3, 4];
const MODE_OPTIONS: Array<{ id: GestureSimulationMode; label: string }> = [
  { id: 'tap', label: '轻点' },
  { id: 'drag', label: '滑动' },
  { id: 'pinch', label: '捏合' },
  { id: 'rotate', label: '旋转' },
  { id: 'press', label: '深按' },
];

const TAP_DELAY_MS = 260;
const EDGE_THRESHOLD_RATIO = 0.18;

function clampPoint(point: Point, width: number, height: number): Point {
  return {
    x: Math.max(0, Math.min(width, point.x)),
    y: Math.max(0, Math.min(height, point.y)),
  };
}

export default function TrackpadSimulator({
  acceptedGesture,
  disabled,
  onSimulate,
}: TrackpadSimulatorProps) {
  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const tapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTapAtRef = useRef<number>(0);
  const pointerStartRef = useRef<Point | null>(null);

  const [fingerCount, setFingerCount] = useState<FingerCount>(() => acceptedGesture.fingerCount);
  const [mode, setMode] = useState<GestureSimulationMode>(() => acceptedGesture.mode);
  const [dragPreview, setDragPreview] = useState<{ start: Point; end: Point } | null>(null);

  useEffect(() => {
    return () => {
      if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
    };
  }, []);

  const helperText = useMemo(() => {
    switch (mode) {
      case 'tap':
        return '轻点模式：在触控板上点击，双击可模拟智能缩放。';
      case 'drag':
        return '滑动模式：按住并拖拽，适合滚动、翻页、切换桌面和打开通知中心。';
      case 'pinch':
        return '捏合模式：从中间往外拖表示张开，从外往中间拖表示捏合。';
      case 'rotate':
        return '旋转模式：围绕中间拖动，顺时针或逆时针都能被识别。';
      case 'press':
        return '深按模式：在触控板上点击一次，模拟更深一层的点按。';
      default:
        return '';
    }
  }, [mode]);

  const getPoint = (event: ReactPointerEvent<HTMLDivElement>): Point => {
    const element = surfaceRef.current;
    if (!element) return { x: 0, y: 0 };
    const rect = element.getBoundingClientRect();
    return clampPoint(
      { x: event.clientX - rect.left, y: event.clientY - rect.top },
      rect.width,
      rect.height
    );
  };

  const detectEdge = (point: Point, width: number, height: number) => {
    if (point.x <= width * EDGE_THRESHOLD_RATIO) return 'left' as const;
    if (point.x >= width * (1 - EDGE_THRESHOLD_RATIO)) return 'right' as const;
    if (point.y <= height * EDGE_THRESHOLD_RATIO) return 'top' as const;
    if (point.y >= height * (1 - EDGE_THRESHOLD_RATIO)) return 'bottom' as const;
    return 'none' as const;
  };

  const simulateTap = (point: Point) => {
    const now = Date.now();
    const isDoubleTap = now - lastTapAtRef.current < TAP_DELAY_MS * 1.4;
    const tapCount = isDoubleTap ? 2 : 1;

    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
      tapTimeoutRef.current = null;
    }

    if (tapCount === 2) {
      lastTapAtRef.current = 0;
      onSimulate({
        fingerCount,
        mode: 'tap',
        start: point,
        end: point,
        distance: 0,
        tapCount: 2,
        edge: 'none',
      });
      return;
    }

    lastTapAtRef.current = now;
    tapTimeoutRef.current = setTimeout(() => {
      onSimulate({
        fingerCount,
        mode: 'tap',
        start: point,
        end: point,
        distance: 0,
        tapCount: 1,
        edge: 'none',
      });
    }, TAP_DELAY_MS);
  };

  const simulatePress = (point: Point) => {
    onSimulate({
      fingerCount,
      mode: 'press',
      start: point,
      end: point,
      distance: 0,
      edge: 'none',
    });
  };

  const simulateMoveGesture = (
    start: Point,
    end: Point,
    modeValue: GestureSimulationMode,
    width: number,
    height: number
  ) => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    const distance = Math.hypot(dx, dy);
    const center = { x: width / 2, y: height / 2 };
    const startRadius = Math.hypot(start.x - center.x, start.y - center.y);
    const endRadius = Math.hypot(end.x - center.x, end.y - center.y);
    const startAngle = Math.atan2(start.y - center.y, start.x - center.x);
    const endAngle = Math.atan2(end.y - center.y, end.x - center.x);

    let direction: GestureSimulationInput['direction'];
    if (absDx > absDy) {
      direction = dx >= 0 ? 'right' : 'left';
    } else if (absDy > 0) {
      direction = dy >= 0 ? 'down' : 'up';
    }

    const edge = detectEdge(start, width, height);
    const pinchKind: GesturePinchKind | undefined =
      modeValue === 'pinch' ? (endRadius > startRadius ? 'out' : 'in') : undefined;
    const rotationDirection: GestureRotationDirection | undefined =
      modeValue === 'rotate'
        ? normalizeRotation(endAngle - startAngle) >= 0
          ? 'clockwise'
          : 'counterclockwise'
        : undefined;

    onSimulate({
      fingerCount,
      mode: modeValue,
      start,
      end,
      distance,
      direction,
      edge,
      pinchKind,
      rotationDirection,
    });
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    const point = getPoint(event);
    pointerStartRef.current = point;
    setDragPreview({ start: point, end: point });
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || !pointerStartRef.current) return;
    const point = getPoint(event);
    setDragPreview({ start: pointerStartRef.current, end: point });
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || !pointerStartRef.current || !surfaceRef.current) return;
    const end = getPoint(event);
    const start = pointerStartRef.current;
    const rect = surfaceRef.current.getBoundingClientRect();
    const distance = Math.hypot(end.x - start.x, end.y - start.y);

    pointerStartRef.current = null;
    setDragPreview(null);

    if (mode === 'tap') {
      simulateTap(end);
      return;
    }

    if (mode === 'press') {
      simulatePress(end);
      return;
    }

    if (distance < 16) {
      return;
    }

    simulateMoveGesture(start, end, mode, rect.width, rect.height);
  };

  return (
    <div className="rounded-[28px] border border-border bg-surface p-4 md:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[12px] font-medium tracking-[0.04em] text-gold-dim">触控板模拟区</div>
          <div className="mt-1 text-[12px] font-light text-ink-tertiary">
            先选指数量，再在下方区域模拟动作。
          </div>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {FINGER_OPTIONS.map((option) => (
          <button
            key={`finger-${option}`}
            type="button"
            onClick={() => setFingerCount(option)}
            className={`rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors ${
              fingerCount === option
                ? 'border-gold-light bg-[#FFF8F0] text-gold-dim'
                : 'border-border bg-white text-ink-secondary hover:border-gold-light'
            }`}
          >
            {option} 指
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {MODE_OPTIONS.map((option) => (
          <button
            key={`mode-${option.id}`}
            type="button"
            onClick={() => setMode(option.id)}
            className={`rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors ${
              mode === option.id
                ? 'border-gold-light bg-[#FFF8F0] text-gold-dim'
                : 'border-border bg-white text-ink-secondary hover:border-gold-light'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div
        ref={surfaceRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative aspect-[1.35/1] overflow-hidden rounded-[28px] border border-[#E6E1D8] bg-[linear-gradient(180deg,#F8F5F0_0%,#EFE9DF_100%)]"
      >
        <div className="absolute inset-x-[12%] top-[18%] h-[62%] rounded-[26px] border border-white/85 bg-[linear-gradient(180deg,rgba(255,255,255,0.68)_0%,rgba(255,255,255,0.28)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]" />
        <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-dim/18" />

        {dragPreview && (
          <>
            <div
              className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-dim/25"
              style={{ left: dragPreview.start.x, top: dragPreview.start.y }}
            />
            <div
              className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-dim/40"
              style={{ left: dragPreview.end.x, top: dragPreview.end.y }}
            />
            <div
              className="absolute origin-left rounded-full bg-gold-dim/35"
              style={{
                left: dragPreview.start.x,
                top: dragPreview.start.y,
                width: Math.max(6, Math.hypot(dragPreview.end.x - dragPreview.start.x, dragPreview.end.y - dragPreview.start.y)),
                height: 2,
                transform: `rotate(${Math.atan2(dragPreview.end.y - dragPreview.start.y, dragPreview.end.x - dragPreview.start.x)}rad)`,
              }}
            />
          </>
        )}

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/80 bg-white/70 px-3 py-1 text-[11px] font-medium text-ink-secondary">
          {helperText}
        </div>
      </div>
    </div>
  );
}

function normalizeRotation(angle: number) {
  let normalized = angle;
  if (normalized > Math.PI) normalized -= Math.PI * 2;
  if (normalized < -Math.PI) normalized += Math.PI * 2;
  return normalized * -1;
}
