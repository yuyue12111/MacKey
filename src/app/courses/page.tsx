import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function StartPage() {
  return (
    <div className="max-w-[720px] mx-auto px-6 py-16 md:py-24">
      <div className="text-center mb-14">
        <h1 className="font-[var(--font-display)] text-4xl md:text-5xl font-[200] tracking-[-0.02em] mb-3">
          选择练习方向
        </h1>
        <p className="text-[15px] text-ink-secondary font-light">
          直接上手，在实践中学会一切
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Keyboard */}
        <Link
          href="/practice/keyboard"
          className="group block bg-surface border border-border rounded-2xl p-10 md:p-12 hover:border-gold-light hover:shadow-[0_4px_32px_rgba(0,0,0,0.06)] transition-all duration-200 no-underline text-inherit"
        >
          <div className="w-14 h-14 rounded-2xl bg-[rgba(212,165,116,0.10)] flex items-center justify-center text-3xl mb-6 group-hover:scale-105 transition-transform duration-200">
            ⌨
          </div>
          <h2 className="font-[var(--font-display)] text-2xl font-[350] tracking-[-0.01em] mb-2">
            键盘快捷键
          </h2>
          <p className="text-[14px] text-ink-secondary font-light leading-relaxed mb-6">
            在操作中掌握所有 Mac 键盘快捷键，从拷贝粘贴到窗口管理。
          </p>
          <span className="inline-flex items-center gap-1.5 text-gold-dim text-[14px] font-medium group-hover:text-gold transition-colors">
            开始练习 <ChevronRight size={16} strokeWidth={1.5} />
          </span>
        </Link>

        {/* Gesture */}
        <Link
          href="/gestures"
          className="group block bg-surface border border-border rounded-2xl p-10 md:p-12 hover:border-gold-light hover:shadow-[0_4px_32px_rgba(0,0,0,0.06)] transition-all duration-200 no-underline text-inherit"
        >
          <div className="w-14 h-14 rounded-2xl bg-[rgba(140,140,180,0.10)] flex items-center justify-center text-3xl mb-6 group-hover:scale-105 transition-transform duration-200">
            🖐
          </div>
          <h2 className="font-[var(--font-display)] text-2xl font-[350] tracking-[-0.01em] mb-2">
            触控板手势
          </h2>
          <p className="text-[14px] text-ink-secondary font-light leading-relaxed mb-6">
            掌握单指到四指的所有手势，让触控板成为你的第二双手。
          </p>
          <span className="inline-flex items-center gap-1.5 text-gold-dim text-[14px] font-medium group-hover:text-gold transition-colors">
            开始练习 <ChevronRight size={16} strokeWidth={1.5} />
          </span>
        </Link>
      </div>
    </div>
  );
}
