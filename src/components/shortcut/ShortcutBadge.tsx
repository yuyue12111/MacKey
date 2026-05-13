import type { ModifierKey } from '@/types/shortcut';

interface ShortcutBadgeProps {
  modifiers: ModifierKey[];
  keyName: string;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_MAP = {
  sm: 'text-[11px] px-1.5 py-0.5 rounded-[5px]',
  md: 'text-sm px-2 py-1 rounded-md',
  lg: 'text-lg px-3 py-1.5 rounded-lg',
};

export default function ShortcutBadge({ modifiers, keyName, size = 'md' }: ShortcutBadgeProps) {
  const parts = [...modifiers, keyName];

  return (
    <span className="inline-flex items-center gap-0.5 font-mono">
      {parts.map((part, i) => (
        <span key={i} className="inline-flex items-center gap-0.5">
          {i > 0 && (
            <span className="text-ink-tertiary text-xs mx-0.5">+</span>
          )}
          <kbd
            className={`inline-flex items-center justify-center bg-surface border border-border font-mono font-normal text-ink tracking-[0.03em] shadow-[0_1px_0_1px_rgba(0,0,0,0.04)] ${SIZE_MAP[size]}`}
          >
            {part}
          </kbd>
        </span>
      ))}
    </span>
  );
}
