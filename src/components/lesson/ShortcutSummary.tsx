import Link from 'next/link';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import type { Shortcut } from '@/types/shortcut';
import ShortcutCard from '@/components/shortcut/ShortcutCard';
import { useProgressStore } from '@/store/progress-store';

interface ShortcutSummaryProps {
  shortcuts: Shortcut[];
  lessonId: string;
  nextLessonUrl: string | null;
}

export default function ShortcutSummary({ shortcuts, lessonId, nextLessonUrl }: ShortcutSummaryProps) {
  const completeLesson = useProgressStore((s) => s.completeLesson);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="text-center mb-10">
        <CheckCircle2 size={48} className="text-gold mx-auto mb-4" strokeWidth={1.2} />
        <h2 className="font-[var(--font-display)] text-2xl font-[300] tracking-[-0.01em] mb-2">
          太棒了！
        </h2>
        <p className="text-[15px] text-ink-secondary font-light">
          你已掌握本课的 {shortcuts.length} 个快捷键
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-10">
        {shortcuts.map((s) => (
          <ShortcutCard key={s.id} shortcut={s} showComparison />
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 flex-wrap">
        <button
          onClick={() => completeLesson(lessonId)}
          className="inline-flex items-center gap-2 bg-ink text-white px-6 py-2.5 rounded-full text-[14px] font-medium hover:bg-[#333] transition-colors"
        >
          <CheckCircle2 size={16} strokeWidth={1.5} />
          完成课程
        </button>
        {nextLessonUrl && (
          <Link
            href={nextLessonUrl}
            className="inline-flex items-center gap-1 text-[14px] text-gold-dim hover:text-gold transition-colors no-underline font-medium"
          >
            下一课 <ChevronRight size={16} strokeWidth={1.2} />
          </Link>
        )}
      </div>
    </div>
  );
}
