'use client';

import { useMemo } from 'react';
import { ANSI_LAYOUT } from '@/lib/keyboard-map';
import KeyCap from './KeyCap';
import { cn } from '@/lib/cn';
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

  const highlightedSet = useMemo(
    () => new Set(highlightedKeys ?? []),
    [highlightedKeys]
  );

  return (
    <div className="flex flex-col items-center gap-[5px] py-2">
      {ANSI_LAYOUT.rows.map((row) => (
        <div key={row.id} className="flex gap-[5px] justify-center">
          {row.keys.map((keyDef, idx) => {
            if (!keyDef) {
              return <div key={`gap-${idx}`} style={{ width: 28 }} />;
            }
            return (
              <KeyCap
                key={keyDef.code}
                label={keyDef.label}
                subLabel={keyDef.subLabel}
                width={keyDef.width}
                isModifier={keyDef.isModifier}
                winBadge={keyDef.winBadge}
                highlighted={highlightedSet.has(keyDef.code)}
                accent={ACCENT_KEYS.has(keyDef.code)}
                showWinBadge={effectiveShowWin}
                onClick={() => !readonly && onKeyClick?.(keyDef.code)}
                onMouseDown={() => !readonly && onKeyDown?.(keyDef.code)}
                onMouseUp={() => !readonly && onKeyUp?.(keyDef.code)}
                onMouseLeave={() => !readonly && onKeyUp?.(keyDef.code)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
