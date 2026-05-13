'use client';

import { useState, useCallback } from 'react';
import MacKeyboard from '@/components/keyboard/MacKeyboard';
import { useKeyDetector } from '@/hooks/useKeyDetector';
import type { KeyCombo } from '@/hooks/useKeyDetector';
import { getAllShortcuts } from '@/lib/shortcuts';
import ShortcutCard from '@/components/shortcut/ShortcutCard';
import DangerWarning from '@/components/lesson/DangerWarning';

const ALL_SHORTCUTS = getAllShortcuts();

export default function PracticePage() {
  const [highlightedKeys, setHighlightedKeys] = useState<string[]>([]);
  const [matchedShortcuts, setMatchedShortcuts] = useState<string[]>([]);

  const handleCombo = useCallback((combo: KeyCombo) => {
    // Build normalized combo string
    const comboMods = combo.modifiers;
    const comboCode = combo.code;

    const matched = ALL_SHORTCUTS.filter((s) => {
      const scMods = s.combination.modifiers.map((m) => {
        if (m === '⌘') return '⌘';
        if (m === '⌥') return '⌥';
        if (m === '⌃') return '⌃';
        if (m === '⇧') return '⇧';
        if (m === 'Fn') return 'Fn';
        return m;
      });
      const modMatch =
        scMods.length === comboMods.length &&
        scMods.every((m) => comboMods.includes(m));
      const keyMatch = s.combination.code === comboCode;
      return modMatch && keyMatch;
    });

    setMatchedShortcuts(matched.map((s) => s.id));
  }, []);

  const { pressedKeys } = useKeyDetector({
    preventDefaults: true,
    onCombination: handleCombo,
  });

  const highlighted = Array.from(pressedKeys);
  const matchedShortcutObjects = ALL_SHORTCUTS.filter((s) =>
    matchedShortcuts.includes(s.id)
  );

  return (
    <div className="max-w-[960px] mx-auto px-6 py-12">
      <DangerWarning />

      {/* ── Header ──────────────────── */}
      <div className="mb-8">
        <h1 className="font-[var(--font-display)] text-4xl font-[250] tracking-[-0.02em] mb-3">
          自由练习
        </h1>
        <p className="text-[15px] text-ink-secondary font-light">
          按下任意组合键，虚拟键盘会实时高亮，匹配到的快捷键会显示在下方。
          试试 ⌘C、⌘Space、⌃↑ 等组合。
        </p>
      </div>

      {/* ── Keyboard ────────────────── */}
      <div className="bg-surface border border-border rounded-2xl px-10 py-12 mb-8 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_8px_32px_rgba(0,0,0,0.04)] overflow-x-auto">
        <MacKeyboard
          highlightedKeys={highlighted}
          onKeyDown={(code) => {
            setHighlightedKeys((prev) => [...new Set([...prev, code])]);
          }}
          onKeyUp={(code) => {
            setHighlightedKeys((prev) => prev.filter((k) => k !== code));
          }}
        />
      </div>

      {/* ── Matched Shortcuts ───────── */}
      {matchedShortcutObjects.length > 0 && (
        <div>
          <h2 className="font-[var(--font-display)] text-lg font-[400] tracking-[-0.01em] mb-4">
            匹配的快捷键
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {matchedShortcutObjects.map((s) => (
              <ShortcutCard key={s.id} shortcut={s} showComparison />
            ))}
          </div>
        </div>
      )}

      {/* ── Empty state ─────────────── */}
      {matchedShortcutObjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-ink-tertiary font-light text-sm">
            尚未匹配到快捷键，试试按下组合键看看
          </p>
        </div>
      )}
    </div>
  );
}
