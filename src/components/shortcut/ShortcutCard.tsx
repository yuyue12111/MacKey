'use client';

import type { Shortcut } from '@/types/shortcut';
import ShortcutBadge from './ShortcutBadge';
import { useProgressStore } from '@/store/progress-store';
import { Star } from 'lucide-react';

interface ShortcutCardProps {
  shortcut: Shortcut;
  showComparison?: boolean;
}

const DIFFICULTY_LABELS: Record<string, string> = {
  basic: '基础',
  intermediate: '进阶',
  advanced: '高级',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  basic: 'text-emerald-600 bg-emerald-50',
  intermediate: 'text-amber-600 bg-amber-50',
  advanced: 'text-red-600 bg-red-50',
};

export default function ShortcutCard({ shortcut, showComparison = false }: ShortcutCardProps) {
  const { favoriteShortcuts, toggleFavorite } = useProgressStore();
  const isFavorite = favoriteShortcuts.includes(shortcut.id);

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 hover:border-gold-light hover:shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition-all duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <ShortcutBadge
              modifiers={shortcut.combination.modifiers}
              keyName={shortcut.combination.key}
              size="md"
            />
            <span className="text-[15px] font-medium text-ink">{shortcut.nameZh}</span>
          </div>
          <p className="text-[13px] text-ink-secondary font-light leading-relaxed mb-3">
            {shortcut.descriptionZh}
          </p>
          {shortcut.tips && (
            <p className="text-[12px] text-gold-dim font-light leading-relaxed mb-3">
              💡 {shortcut.tips}
            </p>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_COLORS[shortcut.difficulty]}`}
            >
              {DIFFICULTY_LABELS[shortcut.difficulty]}
            </span>
            {shortcut.scenarios.map((s) => (
              <span
                key={s}
                className="text-[11px] px-2 py-0.5 rounded-full bg-[#F5F3EF] text-ink-tertiary font-normal"
              >
                {s}
              </span>
            ))}
          </div>

          {showComparison && shortcut.windowsEquivalent && (
            <div className="mt-3 pt-3 border-t border-border-light">
              <p className="text-[12px] text-ink-tertiary font-light">
                Windows: <ShortcutBadge
                  modifiers={shortcut.windowsEquivalent.modifiers}
                  keyName={shortcut.windowsEquivalent.key}
                  size="sm"
                />
                {shortcut.windowsEquivalent.note && (
                  <span className="ml-1">— {shortcut.windowsEquivalent.note}</span>
                )}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(shortcut.id);
          }}
          className="p-1.5 rounded-lg hover:bg-surface-hover transition-colors shrink-0"
          aria-label={isFavorite ? '取消收藏' : '收藏'}
        >
          <Star
            size={16}
            className={isFavorite ? 'text-gold fill-gold' : 'text-ink-tertiary'}
          />
        </button>
      </div>
    </div>
  );
}
