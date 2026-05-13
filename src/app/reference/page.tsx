'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { CATEGORIES, searchShortcuts, getAllShortcuts } from '@/lib/shortcuts';
import ShortcutCard from '@/components/shortcut/ShortcutCard';
import { cn } from '@/lib/cn';

export default function ReferencePage() {
  const [query, setQuery] = useState('');
  const shortcuts = useMemo(() => (query ? searchShortcuts(query) : getAllShortcuts()), [query]);

  return (
    <div className="max-w-[1040px] mx-auto px-6 py-12">
      {/* ── Header ──────────────────── */}
      <div className="mb-12">
        <h1 className="font-[var(--font-display)] text-4xl font-[250] tracking-[-0.02em] mb-3">
          快捷键参考手册
        </h1>
        <p className="text-[15px] text-ink-secondary font-light max-w-lg">
          按分类浏览所有 macOS 快捷键，或搜索你需要的操作
        </p>
      </div>

      {/* ── Search ──────────────────── */}
      <div className="relative mb-10">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-tertiary"
          strokeWidth={1.2}
        />
        <input
          type="text"
          placeholder="搜索快捷键，如「复制」「截图」「光标」…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-12 pl-12 pr-4 bg-surface border border-border rounded-2xl text-[15px] text-ink placeholder:text-ink-tertiary/60 font-light outline-none focus:border-gold-light focus:ring-1 focus:ring-gold-light/30 transition-all"
        />
      </div>

      {/* ── Search Results ──────────── */}
      {query && (
        <div className="mb-12">
          <p className="text-[13px] text-ink-tertiary font-light mb-5">
            找到 {shortcuts.length} 个匹配的快捷键
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {shortcuts.map((s) => (
              <ShortcutCard key={s.id} shortcut={s} showComparison />
            ))}
          </div>
          {shortcuts.length === 0 && (
            <p className="text-ink-tertiary text-center py-16 font-light">
              没有找到匹配的快捷键，试试其他关键词
            </p>
          )}
        </div>
      )}

      {/* ── Category Grid ───────────── */}
      {!query && (
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/reference/${cat.slug}`}
              className="group block bg-surface border border-border rounded-2xl p-6 hover:border-gold-light hover:shadow-[0_4px_24px_rgba(0,0,0,0.05)] transition-all duration-200 no-underline text-inherit -translate-y-0.5 hover:-translate-y-0"
            >
              <span className="text-2xl mb-3 block">{cat.icon}</span>
              <h3 className="font-[var(--font-display)] text-base font-[400] tracking-[-0.01em] mb-1.5">
                {cat.nameZh}
              </h3>
              <p className="text-[12px] text-ink-tertiary font-light leading-relaxed">
                {cat.descriptionZh}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
