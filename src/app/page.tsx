'use client';

import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { ArrowDown, ArrowRight, Hand, Keyboard, Search, Sparkles, Zap } from 'lucide-react';
import { MotionReveal, MotionStagger } from '@/components/ui/motion';

const featureCards = [
  {
    icon: <Keyboard size={26} strokeWidth={1.25} />,
    title: '键盘快捷键',
    desc: '从复制、搜索到截图，每个动作都能看到键位反馈，而不是只看说明。',
    hint: '按下组合键，立刻看到对应按键被唤醒',
  },
  {
    icon: <Hand size={26} strokeWidth={1.25} />,
    title: '触控板手势',
    desc: '两指、三指、四指动作都有节奏清晰的演示，适合从 Windows 迁移的用户。',
    hint: '先看动作，再做动作，形成身体记忆',
  },
  {
    icon: <Zap size={26} strokeWidth={1.25} />,
    title: '场景化练习',
    desc: '不是背快捷键表，而是在 Finder、桌面和编辑器里做出真实操作结果。',
    hint: '每一步都有提示和结果反馈，不会练到发空',
  },
];

const quickLinks = [
  { href: '/reference', icon: Search, label: '快捷键手册', desc: '分类浏览', hint: '快速查一个动作怎么按' },
  { href: '/gestures', icon: Hand, label: '触控板手势', desc: '动画演示', hint: '先看演示，再模仿' },
  { href: '/practice', icon: Keyboard, label: '自由练习', desc: '真实键盘', hint: '试按一次，立刻看反馈' },
  { href: '/compare', icon: Sparkles, label: '键位对照', desc: 'Mac ↔ Win', hint: '把旧习惯翻译成新操作' },
];

function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-gold-light/60 bg-[rgba(212,165,116,0.08)] px-3 py-1 text-[11px] font-medium tracking-[0.05em] text-gold-dim">
      {children}
    </span>
  );
}

function ShortcutKey({
  label,
  subLabel,
  widthClass = 'w-14',
  delay = 0,
}: {
  label: string;
  subLabel?: string;
  widthClass?: string;
  delay?: number;
}) {
  return (
    <div
      className={`shortcut-key ${widthClass}`}
      style={{ '--sequence-delay': `${delay}ms` } as CSSProperties}
    >
      <span className="text-[18px] font-[420] text-ink">{label}</span>
      {subLabel && <span className="mt-1 text-[10px] font-light text-ink-tertiary">{subLabel}</span>}
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  hint,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
  hint: string;
}) {
  return (
    <div className="surface-card group h-full rounded-[28px] border border-border bg-surface p-8">
      <div className="surface-card-icon mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(212,165,116,0.08)] text-gold-dim">
        {icon}
      </div>
      <h3 className="mb-2 font-[var(--font-display)] text-lg font-[400] tracking-[-0.01em] text-ink">
        {title}
      </h3>
      <p className="mb-5 text-[13px] font-light leading-relaxed text-ink-secondary">
        {desc}
      </p>
      <div className="surface-card-hint">
        <span className="mr-2 inline-flex h-1.5 w-1.5 rounded-full bg-gold/55" />
        {hint}
      </div>
    </div>
  );
}

function QuickLinkCard({
  href,
  icon: Icon,
  label,
  desc,
  hint,
}: {
  href: string;
  icon: typeof Search;
  label: string;
  desc: string;
  hint: string;
}) {
  return (
    <Link
      href={href}
      className="surface-card group flex h-full flex-col justify-between rounded-[24px] border border-border bg-surface p-5 no-underline"
    >
      <div className="mb-7 flex items-start justify-between">
        <div className="surface-card-icon flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(212,165,116,0.08)] text-gold-dim">
          <Icon size={20} strokeWidth={1.2} />
        </div>
        <ArrowRight
          size={16}
          strokeWidth={1.5}
          className="translate-y-0 text-ink-tertiary transition-transform duration-300 group-hover:translate-x-1 group-hover:text-gold-dim"
        />
      </div>

      <div>
        <div className="mb-0.5 text-sm font-medium text-ink">{label}</div>
        <div className="mb-3 text-[11px] font-light text-ink-tertiary">{desc}</div>
        <div className="surface-card-hint text-[11px]">{hint}</div>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden px-6 pb-20 pt-28 md:pb-24 md:pt-36">
        <div className="pointer-events-none absolute left-1/2 top-28 -translate-x-1/2">
          <div className="ambient-orb h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(212,165,116,0.12)_0%,rgba(212,165,116,0.04)_34%,transparent_72%)]" />
        </div>
        <div className="pointer-events-none absolute right-[12%] top-20">
          <div className="ambient-orb ambient-orb-secondary h-[240px] w-[240px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.8)_0%,rgba(255,255,255,0.0)_72%)]" />
        </div>

        <div className="relative mx-auto flex min-h-[calc(100vh-9rem)] max-w-[1120px] flex-col justify-center">
          <MotionStagger className="max-w-[760px]" delayStep={88}>
            <SectionEyebrow>Mac 入门，不靠背诵</SectionEyebrow>
            <h1 className="mt-6 font-[var(--font-display)] text-4xl font-[220] leading-[1.03] tracking-[-0.045em] text-ink md:text-6xl lg:text-[84px]">
              不用读，
              <span className="bg-[linear-gradient(135deg,#D4A574_0%,#B88960_85%)] bg-clip-text text-transparent"> 直接练</span>
            </h1>
            <p className="mt-6 max-w-[560px] text-[17px] font-[350] leading-relaxed text-ink-secondary md:text-[18px]">
              用更安静、更直接的方式学会 macOS。看到提示，按下组合键，马上得到结果反馈。
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[15px] font-medium text-white no-underline transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2D2D30] hover:shadow-[0_14px_30px_rgba(28,28,30,0.16)]"
              >
                开始第一课 <ArrowRight size={17} strokeWidth={1.5} />
              </Link>
              <Link
                href="/practice"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white/72 px-5 py-3 text-[14px] font-medium text-ink no-underline transition-all duration-300 hover:border-gold-light hover:bg-white hover:shadow-[0_10px_24px_rgba(0,0,0,0.06)]"
              >
                先试一下实时键盘
              </Link>
            </div>
          </MotionStagger>

          <MotionReveal className="mt-16 max-w-[720px]" delay={180}>
            <div className="rounded-[32px] border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.88)_0%,rgba(255,255,255,0.72)_100%)] p-5 shadow-[0_24px_80px_rgba(28,28,30,0.08)] backdrop-blur-xl md:p-6">
              <div className="flex items-center justify-between gap-4 border-b border-border-light pb-4">
                <div>
                  <div className="text-[12px] font-medium tracking-[0.04em] text-gold-dim">像这样学会第一个动作</div>
                  <div className="mt-1 text-[14px] font-light text-ink-secondary">不是看说明书，而是看按键怎么被触发。</div>
                </div>
                <div className="rounded-full border border-border bg-white/80 px-3 py-1 text-[11px] font-medium text-ink-secondary">
                  一次性示范
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="shortcut-sequence flex flex-wrap items-center gap-3">
                  <ShortcutKey label="⌘" subLabel="command" delay={160} />
                  <span className="text-[18px] font-light text-ink-tertiary">+</span>
                  <ShortcutKey label="space" widthClass="w-24" delay={320} />
                  <span className="shortcut-result rounded-full border border-gold-light/70 bg-[#FFF8F0] px-3 py-1.5 text-[11px] font-medium text-gold-dim" style={{ '--sequence-delay': '540ms' } as CSSProperties}>
                    聚焦搜索，立即开始
                  </span>
                </div>

                <div className="rounded-[22px] border border-border bg-[rgba(250,250,248,0.86)] px-4 py-3">
                  <div className="text-[11px] font-medium tracking-[0.04em] text-ink-secondary">教学反馈</div>
                  <div className="mt-1 text-[13px] font-light leading-relaxed text-ink-tertiary">
                    按键、结果、提示都在一条节奏里，不会把注意力打散。
                  </div>
                </div>
              </div>
            </div>
          </MotionReveal>

          <MotionReveal className="mt-10" delay={260} variant="fade">
            <div className="inline-flex items-center gap-2 text-[12px] font-light text-ink-tertiary">
              <span>继续往下看我们怎么把快捷键变成可感知的练习</span>
              <ArrowDown size={15} strokeWidth={1.2} className="text-ink-tertiary/70" />
            </div>
          </MotionReveal>
        </div>
      </section>

      <hr className="section-divider" />

      <section className="mx-auto max-w-[1040px] px-6 py-24 md:py-32">
        <MotionStagger className="mb-[4.5rem] text-center md:mb-20" delayStep={76}>
          <SectionEyebrow>怎么学</SectionEyebrow>
          <h2 className="mt-5 font-[var(--font-display)] text-3xl font-[220] tracking-[-0.03em] text-ink md:text-5xl">
            不读文档，
            <br />
            直接上手操作
          </h2>
          <p className="mx-auto mt-5 max-w-[520px] text-[15px] font-light leading-relaxed text-ink-secondary md:text-base">
            从键盘到触控板，每个动作都先让你看懂，再让你做对，最后让你记住。
          </p>
        </MotionStagger>

        <div className="grid gap-5 md:grid-cols-3">
          {featureCards.map((card, index) => (
            <MotionReveal key={card.title} delay={index * 90}>
              <FeatureCard {...card} />
            </MotionReveal>
          ))}
        </div>
      </section>

      <hr className="section-divider" />

      <section className="mx-auto max-w-[1040px] px-6 py-24 md:py-32">
        <MotionStagger className="mb-12 md:mb-14" delayStep={72}>
          <SectionEyebrow>快速开始</SectionEyebrow>
          <div className="mt-5 max-w-[560px]">
            <h2 className="font-[var(--font-display)] text-3xl font-[220] tracking-[-0.03em] text-ink md:text-5xl">
              想查、想练、想对照，
              <br />
              都可以马上开始
            </h2>
            <p className="mt-5 text-[15px] font-light leading-relaxed text-ink-secondary">
              每个入口都给你一个明确动作，不需要猜这个页面是做什么的。
            </p>
          </div>
        </MotionStagger>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {quickLinks.map((item, index) => (
            <MotionReveal key={item.href} delay={index * 70}>
              <QuickLinkCard {...item} />
            </MotionReveal>
          ))}
        </div>
      </section>

      <hr className="section-divider" />

      <section className="relative overflow-hidden px-6 pb-36 pt-24 text-center md:pb-40 md:pt-32">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(212,165,116,0.05)_50%,rgba(212,165,116,0.08)_100%)] pointer-events-none" />
        <div className="pointer-events-none absolute bottom-[-80px] left-1/2 -translate-x-1/2">
          <div className="ambient-orb h-[460px] w-[760px] rounded-full bg-[radial-gradient(circle,rgba(212,165,116,0.11)_0%,transparent_70%)]" />
        </div>

        <MotionStagger className="relative mx-auto max-w-[760px]" delayStep={90}>
          <SectionEyebrow>准备开始</SectionEyebrow>
          <h2 className="mt-5 font-[var(--font-display)] text-4xl font-[220] tracking-[-0.035em] text-ink md:text-6xl">
            一分钟内，
            <br />
            开始你的第一课
          </h2>
          <p className="mx-auto mt-5 max-w-[460px] text-[15px] font-light leading-relaxed text-ink-secondary">
            不需要预习，不需要记笔记。先按一次，再慢慢把熟悉感留在手上。
          </p>
          <div className="mt-9">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-10 py-4 text-[16px] font-medium text-white no-underline transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2D2D30] hover:shadow-[0_16px_36px_rgba(28,28,30,0.16)]"
            >
              开始上手 <ArrowRight size={18} strokeWidth={1.5} />
            </Link>
          </div>
        </MotionStagger>
      </section>
    </>
  );
}
