import Link from 'next/link';
import { BookOpen, Search, Hand, Gamepad2, ArrowRight, Lightbulb } from 'lucide-react';

const COURSES = [
  {
    href: '/courses',
    icon: '🔰',
    iconBg: 'bg-[rgba(212,165,116,0.12)]',
    title: 'macOS 入门必修课',
    desc: '认识 ⌘⌥⌃⇧ 四个修饰键，掌握最常用的 10 个快捷键，学会截图三式。从 Windows 切换的第一课。',
    meta: ['4 章节', '45 分钟', '基础'],
  },
  {
    href: '/courses',
    icon: '⚡',
    iconBg: 'bg-[rgba(140,160,140,0.12)]',
    title: '效率翻倍进阶课',
    desc: '窗口管理、Emacs 风格光标移动、访达高效操作、浏览器快捷键。让键盘操作成为肌肉记忆。',
    meta: ['5 章节', '60 分钟', '进阶'],
  },
  {
    href: '/courses',
    icon: '🖐',
    iconBg: 'bg-[rgba(140,140,180,0.12)]',
    title: '触控板完全指南',
    desc: '从单指点击到四指切换桌面，用动画演示每个手势的轨迹。掌握 Mac 触控板的全部潜力。',
    meta: ['4 章节', '30 分钟', '基础'],
  },
];

const QUICK_LINKS = [
  { href: '/reference', icon: Search, label: '快捷键参考手册', desc: '按分类浏览所有快捷键' },
  { href: '/gestures', icon: Hand, label: '触控板手势', desc: '动画演示每个手势' },
  { href: '/practice', icon: Gamepad2, label: '自由练习', desc: '用真实键盘练习' },
  { href: '/compare', icon: BookOpen, label: '键位对照', desc: 'Mac ↔ Windows 键位表' },
];

const DAILY_TIP = {
  shortcut: '⌘Space',
  title: 'Spotlight — Mac 的万能入口',
  desc: '按下 ⌘Space 打开 Spotlight，不仅能启动 App，还能做计算器、查字典、搜文件。试试输入 "(128+256)*3" 看会发生什么？',
};

export default function Home() {
  return (
    <>
      {/* ── Hero ──────────────────────── */}
      <section className="pt-24 pb-16 md:pt-36 md:pb-20 text-center px-6 max-w-[800px] mx-auto">
        <span className="inline-block px-3.5 py-1 rounded-full bg-[rgba(212,165,116,0.10)] text-gold-dim text-[11px] font-medium tracking-[0.04em] mb-8">
          为 Mac 新手设计
        </span>

        <h1 className="font-[var(--font-display)] text-5xl md:text-7xl font-[200] tracking-[-0.03em] leading-[1.1] mb-6 text-ink">
          像呼吸一样
          <br />
          使用你的{' '}
          <span className="bg-gradient-to-br from-gold to-gold-dim bg-clip-text text-transparent">
            Mac
          </span>
        </h1>

        <p className="text-[17px] md:text-lg text-ink-secondary max-w-[520px] mx-auto mb-10 font-[350] leading-relaxed">
          从键盘到触控板，系统学习 macOS 的所有操作方式。
          不再回到 Windows 的习惯，真正掌握 Mac 的优雅。
        </p>

        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 bg-ink text-white px-7 py-3 rounded-full text-[15px] font-medium hover:bg-[#333] transition-colors no-underline"
          >
            开始免费课程 <ArrowRight size={16} />
          </Link>
          <Link
            href="/reference"
            className="inline-flex items-center gap-1.5 bg-transparent text-ink-secondary border border-border px-7 py-3 rounded-full text-[15px] font-normal hover:border-gold hover:text-gold-dim transition-colors no-underline"
          >
            查看快捷键手册
          </Link>
        </div>
      </section>

      {/* ── Quick Links ───────────────── */}
      <section className="px-6 pb-20 max-w-[960px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {QUICK_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-surface border border-border hover:border-gold-light hover:shadow-[0_4px_24px_rgba(0,0,0,0.05)] transition-all duration-200 no-underline -translate-y-0.5 hover:-translate-y-0"
            >
              <item.icon
                size={24}
                className="text-ink-tertiary group-hover:text-gold-dim transition-colors"
                strokeWidth={1.2}
              />
              <div className="text-center">
                <div className="text-sm font-medium text-ink mb-0.5">{item.label}</div>
                <div className="text-[12px] text-ink-tertiary font-light">{item.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Courses ───────────────────── */}
      <section className="px-6 pb-24 max-w-[1040px] mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-[250] tracking-[-0.02em] mb-3">
            三门课程，从入门到精通
          </h2>
          <p className="text-[15px] text-ink-secondary font-light">
            按你自己的节奏，逐步掌握 Mac 的所有操作
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {COURSES.map((course) => (
            <Link
              key={course.title}
              href={course.href}
              className="group block bg-surface border border-border rounded-2xl p-8 hover:border-gold-light hover:shadow-[0_4px_24px_rgba(0,0,0,0.05)] transition-all duration-200 no-underline text-inherit -translate-y-0.5 hover:-translate-y-0"
            >
              <div
                className={`w-11 h-11 rounded-2xl ${course.iconBg} flex items-center justify-center text-xl mb-5`}
              >
                {course.icon}
              </div>
              <h3 className="font-[var(--font-display)] text-lg font-[400] tracking-[-0.01em] mb-2">
                {course.title}
              </h3>
              <p className="text-[13px] text-ink-secondary leading-relaxed font-light mb-5">
                {course.desc}
              </p>
              <div className="flex gap-4 text-[12px] text-ink-tertiary font-normal">
                {course.meta.map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Daily Tip ─────────────────── */}
      <section className="px-6 pb-28 max-w-[680px] mx-auto">
        <div className="bg-surface border border-border rounded-2xl p-8 md:p-10 flex flex-col md:flex-row gap-6 items-start">
          <div className="w-12 h-12 rounded-xl bg-[rgba(212,165,116,0.10)] flex items-center justify-center shrink-0">
            <Lightbulb size={22} className="text-gold-dim" strokeWidth={1.2} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-medium text-gold-dim tracking-[0.06em] uppercase">
                今日推荐
              </span>
              <span className="font-mono text-lg font-light text-ink tracking-[0.04em]">
                {DAILY_TIP.shortcut}
              </span>
            </div>
            <h3 className="font-[var(--font-display)] text-xl font-[400] tracking-[-0.01em] mb-1.5">
              {DAILY_TIP.title}
            </h3>
            <p className="text-[14px] text-ink-secondary font-light leading-relaxed">
              {DAILY_TIP.desc}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
