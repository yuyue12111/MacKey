import { cn } from '@/lib/cn';

interface KeyCapProps {
  label: string;
  subLabel?: string;
  width: number; // 1u = 46px
  isModifier?: boolean;
  winBadge?: string;
  highlighted?: boolean;
  accent?: boolean;
  showWinBadge?: boolean;
  onClick?: () => void;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
  onMouseLeave?: () => void;
  className?: string;
}

const BASE = 46;

export default function KeyCap({
  label,
  subLabel,
  width,
  isModifier,
  winBadge,
  highlighted,
  accent,
  showWinBadge,
  onClick,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  className,
}: KeyCapProps) {
  return (
    <div
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      style={{ width: width * BASE }}
      className={cn(
        'relative flex flex-col items-center justify-center rounded-lg cursor-pointer select-none transition-all duration-150 flex-shrink-0',
        'h-[46px]',
        isModifier ? 'bg-[#FAFAF8]' : 'bg-key-bg',
        'border border-[#D1CFC9]',
        'shadow-[0_1px_0_1px_rgba(0,0,0,0.04),0_2px_6px_rgba(0,0,0,0.06)]',
        'hover:shadow-[0_1px_0_1px_rgba(0,0,0,0.04),0_4px_12px_rgba(212,165,116,0.25)] hover:border-gold hover:-translate-y-0.5',
        highlighted && [
          'bg-key-highlight border-gold shadow-[0_1px_0_rgba(0,0,0,0.02)] translate-y-px',
        ],
        accent && [
          'bg-gradient-to-b from-[#FFF8F0] to-[#FFF2E4] border-gold-light',
          'shadow-[0_1px_0_1px_rgba(0,0,0,0.04),0_2px_8px_rgba(212,165,116,0.15)]',
        ],
        className
      )}
    >
      <span
        className={cn(
          'text-[13px] font-[420] text-ink',
          isModifier && 'text-xs font-normal text-ink-secondary',
          accent && 'text-gold-dim font-[550]',
          highlighted && 'text-gold-dim font-[550]'
        )}
      >
        {label}
      </span>
      {subLabel && (
        <span className="text-[9px] font-normal text-ink-tertiary mt-px">
          {subLabel}
        </span>
      )}
      {showWinBadge && winBadge && (
        <span
          className={cn(
            'absolute -top-[6px] -right-[6px] bg-ink text-white text-[8px] px-[5px] py-px rounded-md font-medium tracking-[0.02em]',
            'opacity-100 group-hover:opacity-100 transition-opacity'
          )}
        >
          {winBadge}
        </span>
      )}
    </div>
  );
}
