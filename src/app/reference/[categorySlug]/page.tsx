import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { getCategoryMeta, getShortcutsByCategory } from '@/lib/shortcuts';
import ShortcutCard from '@/components/shortcut/ShortcutCard';
import type { ShortcutCategory } from '@/types/shortcut';

interface Props {
  params: Promise<{ categorySlug: string }>;
}

export default async function CategoryPage({ params }: Props) {
  const { categorySlug } = await params;
  const category = getCategoryMeta(categorySlug);
  if (!category) notFound();

  const shortcuts = getShortcutsByCategory(categorySlug as ShortcutCategory);

  return (
    <div className="max-w-[1040px] mx-auto px-6 py-12">
      {/* ── Back ────────────────────── */}
      <Link
        href="/reference"
        className="inline-flex items-center gap-1 text-sm text-ink-tertiary hover:text-gold-dim transition-colors no-underline mb-8"
      >
        <ChevronLeft size={16} strokeWidth={1.2} /> 返回参考手册
      </Link>

      {/* ── Header ──────────────────── */}
      <div className="mb-10">
        <span className="text-3xl mb-3 block">{category.icon}</span>
        <h1 className="font-[var(--font-display)] text-4xl font-[250] tracking-[-0.02em] mb-2">
          {category.nameZh}
        </h1>
        <p className="text-[15px] text-ink-secondary font-light">
          {category.descriptionZh} · {shortcuts.length} 个快捷键
        </p>
      </div>

      {/* ── Shortcut List ───────────── */}
      <div className="grid md:grid-cols-2 gap-4">
        {shortcuts.map((s) => (
          <ShortcutCard key={s.id} shortcut={s} showComparison />
        ))}
      </div>

      {shortcuts.length === 0 && (
        <p className="text-ink-tertiary text-center py-16 font-light">
          此分类暂无快捷键数据
        </p>
      )}
    </div>
  );
}
