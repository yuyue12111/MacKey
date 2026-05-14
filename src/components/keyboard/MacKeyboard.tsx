'use client';

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ANSI_LAYOUT } from '@/lib/keyboard-map';
import KeyCap from './KeyCap';
import { usePreferenceStore } from '@/store/preference-store';

interface MacKeyboardProps {
  highlightedKeys?: string[];
  showWindowsComparison?: boolean;
  onKeyClick?: (code: string) => void;
  onKeyDown?: (code: string) => void;
  onKeyUp?: (code: string) => void;
  readonly?: boolean;
}

const ACCENT_KEYS = new Set([
  'Fn', 'ControlLeft', 'AltLeft', 'MetaLeft',
  'MetaRight', 'AltRight',
]);

const VERTICAL_PADDING = 8;
const WRAPPER_HEIGHT = VERTICAL_PADDING * 2;

export default function MacKeyboard({
  highlightedKeys,
  showWindowsComparison = true,
  onKeyClick,
  onKeyDown,
  onKeyUp,
  readonly,
}: MacKeyboardProps) {
  const prefsShowWindows = usePreferenceStore((s) => s.showWindowsComparison);
  const effectiveShowWin = showWindowsComparison && prefsShowWindows;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [availableWidth, setAvailableWidth] = useState(ANSI_LAYOUT.width);

  const highlightedSet = useMemo(
    () => new Set(highlightedKeys ?? []),
    [highlightedKeys]
  );

  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateWidth = () => {
      setAvailableWidth(element.clientWidth || ANSI_LAYOUT.width);
    };

    updateWidth();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateWidth);
      return () => window.removeEventListener('resize', updateWidth);
    }

    const observer = new ResizeObserver(() => {
      updateWidth();
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const scale = Math.min(1, availableWidth / ANSI_LAYOUT.width);
  const scaledHeight = ANSI_LAYOUT.height * scale + WRAPPER_HEIGHT;

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: `${scaledHeight}px` }}
    >
      <div
        className="absolute top-2"
        style={{
          left: '50%',
          width: `${ANSI_LAYOUT.width}px`,
          height: `${ANSI_LAYOUT.height}px`,
          marginLeft: `${-ANSI_LAYOUT.width / 2}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
        }}
      >
        {ANSI_LAYOUT.keys.map((keyDef) => (
          <KeyCap
            key={keyDef.code}
            label={keyDef.label}
            subLabel={keyDef.subLabel}
            width={keyDef.width}
            height={keyDef.height}
            isModifier={keyDef.isModifier}
            winBadge={keyDef.winBadge}
            highlighted={highlightedSet.has(keyDef.code)}
            accent={ACCENT_KEYS.has(keyDef.code)}
            showWinBadge={effectiveShowWin}
            className="absolute"
            style={{ left: `${keyDef.x}px`, top: `${keyDef.y}px` }}
            onClick={() => !readonly && onKeyClick?.(keyDef.code)}
            onMouseDown={() => !readonly && onKeyDown?.(keyDef.code)}
            onMouseUp={() => !readonly && onKeyUp?.(keyDef.code)}
            onMouseLeave={() => !readonly && onKeyUp?.(keyDef.code)}
          />
        ))}
      </div>
    </div>
  );
}
