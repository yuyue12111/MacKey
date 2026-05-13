'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS = [
  { href: '/courses', label: '课程' },
  { href: '/reference', label: '参考手册' },
  { href: '/gestures', label: '手势' },
  { href: '/practice', label: '练习' },
  { href: '/compare', label: '键位对照' },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="glass-nav fixed top-0 left-0 right-0 z-50 border-b border-border-light">
      <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-[var(--font-display)] text-xl font-light tracking-[-0.02em] text-ink no-underline flex items-center gap-2"
        >
          <span className="w-7 h-7 rounded-md bg-gradient-to-br from-gold to-gold-dim flex items-center justify-center text-white text-xs font-medium">
            ⌘
          </span>
          MacKey
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-normal text-ink-secondary hover:text-gold-dim transition-colors no-underline"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/courses"
            className="bg-ink text-white text-[13px] font-medium px-5 py-1.5 rounded-full hover:bg-[#333] transition-colors no-underline"
          >
            开始学习
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-1 text-ink-secondary"
          aria-label="菜单"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="md:hidden border-t border-border-light bg-surface/95 backdrop-blur-xl">
          <div className="px-6 py-4 flex flex-col gap-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-[15px] text-ink-secondary hover:text-gold-dim transition-colors py-1 no-underline"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/courses"
              onClick={() => setOpen(false)}
              className="bg-ink text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-[#333] transition-colors no-underline text-center"
            >
              开始学习
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
