'use client';

import type { ReactNode } from 'react';
import type { GestureSimulationStep } from '@/types/course';

interface GestureScenarioVisualProps {
  step: GestureSimulationStep;
  phase: 'prompting' | 'correct' | 'complete';
}

export default function GestureScenarioVisual({
  step,
  phase,
}: GestureScenarioVisualProps) {
  const activeState = phase === 'correct' ? step.successVisualState : 'idle';

  switch (step.scenarioType) {
    case 'browser':
      return <BrowserGestureScene activeState={activeState} title={step.sceneTitleZh} description={step.sceneDescriptionZh} />;
    case 'desktop':
      return <DesktopGestureScene activeState={activeState} title={step.sceneTitleZh} description={step.sceneDescriptionZh} />;
    case 'preview':
      return <PreviewGestureScene activeState={activeState} title={step.sceneTitleZh} description={step.sceneDescriptionZh} />;
    case 'system':
      return <SystemGestureScene activeState={activeState} title={step.sceneTitleZh} description={step.sceneDescriptionZh} />;
    default:
      return null;
  }
}

function SceneFrame({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-surface border border-border rounded-[28px] overflow-hidden shadow-[0_10px_34px_rgba(0,0,0,0.04)]">
      <div className="px-5 py-4 border-b border-border-light bg-[#FBFAF7]">
        <div className="text-[12px] font-medium tracking-[0.04em] text-gold-dim">{title}</div>
        {description && (
          <div className="mt-1 text-[12px] font-light text-ink-tertiary">{description}</div>
        )}
      </div>
      <div className="p-5 md:p-6">{children}</div>
    </div>
  );
}

function BrowserGestureScene({
  activeState,
  title,
  description,
}: {
  activeState: string;
  title: string;
  description?: string;
}) {
  const contextMenuOpen = activeState === 'context-menu-open';
  const pageOpened = activeState === 'page-opened';
  const scrolled = activeState === 'page-scrolled';
  const tableScrolled = activeState === 'table-scrolled';
  const zoomed = activeState === 'zoomed-article';
  const smartZoomed = activeState === 'smart-zoomed';
  const navigatedBack = activeState === 'page-back';
  const notificationOpen = activeState === 'notification-open';

  return (
    <SceneFrame title={title} description={description}>
      <div className="relative min-h-[260px] rounded-[26px] border border-border bg-white overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border-light bg-[#FBFAF7]">
          <span className="h-2.5 w-2.5 rounded-full bg-[#F2C9C9]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#F3E0A4]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#CFE7C9]" />
          <div className="ml-3 rounded-full border border-border bg-white px-3 py-1 text-[11px] text-ink-tertiary">
            {navigatedBack ? '文章列表 / Mac 触控板' : '详细文章 / 触控板技巧'}
          </div>
        </div>

        <div className="relative flex">
          <div className={`flex-1 px-6 py-5 transition-all duration-300 ${scrolled ? '-translate-y-6' : ''}`}>
            <div className={`mb-4 rounded-2xl border border-border bg-[#FBFAF7] p-4 transition-all duration-300 ${
              zoomed || smartZoomed ? 'scale-[1.05] shadow-[0_12px_30px_rgba(212,165,116,0.12)] border-gold-light' : ''
            } ${
              pageOpened ? 'border-gold-light shadow-[0_12px_30px_rgba(212,165,116,0.10)]' : ''
            }`}>
              <div className="text-[12px] font-medium text-ink-secondary mb-2">今天的阅读重点</div>
              <div className={`space-y-2 transition-all duration-300 ${smartZoomed ? 'text-[15px]' : 'text-[13px]'}`}>
                <div className="h-3 rounded-full bg-[#EDE9E1] w-[86%]" />
                <div className="h-3 rounded-full bg-[#EDE9E1] w-[93%]" />
                <div className="h-3 rounded-full bg-[#EDE9E1] w-[74%]" />
              </div>
            </div>

            <div className={`rounded-2xl border border-border bg-[#FCFBF8] p-4 transition-transform duration-300 ${tableScrolled ? '-translate-x-10' : ''}`}>
              <div className="mb-3 text-[12px] font-medium text-ink-secondary">宽表格</div>
              <div className="w-[130%] space-y-2">
                {Array.from({ length: 4 }).map((_, rowIndex) => (
                  <div key={`row-${rowIndex}`} className="grid grid-cols-6 gap-2">
                    {Array.from({ length: 6 }).map((__, colIndex) => (
                      <div
                        key={`col-${rowIndex}-${colIndex}`}
                        className="h-8 rounded-lg bg-[#EFE9DF]"
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-2 bg-[#F3F0EB]">
            <div className={`mx-auto mt-4 w-1 rounded-full bg-gold-dim/35 transition-all duration-300 ${scrolled ? 'h-20 translate-y-8' : 'h-14'}`} />
          </div>

          {contextMenuOpen && (
            <div className="absolute left-12 top-24 w-44 rounded-2xl border border-gold-light bg-white shadow-[0_18px_40px_rgba(0,0,0,0.08)] p-2 text-[12px] text-ink-secondary">
              <div className="rounded-xl px-3 py-2 bg-[#FFF8F0] text-gold-dim">重命名</div>
              <div className="rounded-xl px-3 py-2">压缩</div>
              <div className="rounded-xl px-3 py-2">显示简介</div>
            </div>
          )}

          {notificationOpen && (
            <div className="absolute right-4 top-4 w-[190px] rounded-[22px] border border-gold-light bg-white shadow-[0_18px_42px_rgba(0,0,0,0.10)] p-4">
              <div className="text-[12px] font-medium text-gold-dim mb-2">通知中心</div>
              <div className="rounded-2xl bg-[#FFF8F0] px-3 py-3 text-[12px] text-ink-secondary">
                今天 14:30 的提醒已准备好
              </div>
            </div>
          )}
        </div>
      </div>
    </SceneFrame>
  );
}

function DesktopGestureScene({
  activeState,
  title,
  description,
}: {
  activeState: string;
  title: string;
  description?: string;
}) {
  const missionControl = activeState === 'mission-control';
  const appExpose = activeState === 'app-expose';
  const switchedDesktop = activeState === 'switch-desktop';
  const desktopVisible = activeState === 'show-desktop';
  const launchpadOpen = activeState === 'launchpad-open';

  return (
    <SceneFrame title={title} description={description}>
      <div className="relative min-h-[260px] overflow-hidden rounded-[26px] border border-border bg-[linear-gradient(180deg,#F6F1E8_0%,#EFE6D8_100%)]">
        <div className="absolute left-1/2 top-4 flex -translate-x-1/2 gap-2">
          {['写作', '浏览器', '聊天'].map((label, index) => (
            <div
              key={label}
              className={`rounded-full px-3 py-1 text-[11px] font-medium ${
                switchedDesktop && index === 1
                  ? 'bg-white text-gold-dim shadow-sm'
                  : 'bg-white/55 text-ink-tertiary'
              }`}
            >
              {label}
            </div>
          ))}
        </div>

        {launchpadOpen ? (
          <div className="grid grid-cols-4 gap-4 p-10 pt-16">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={`app-${index}`}
                className="h-16 rounded-2xl bg-white/78 border border-border shadow-[0_8px_18px_rgba(0,0,0,0.04)]"
              />
            ))}
          </div>
        ) : missionControl ? (
          <div className="grid grid-cols-2 gap-4 p-8 pt-16">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`window-${index}`}
                className="h-24 rounded-2xl border border-white/75 bg-white/72 shadow-[0_8px_20px_rgba(0,0,0,0.05)]"
              />
            ))}
          </div>
        ) : appExpose ? (
          <div className="grid grid-cols-2 gap-4 p-8 pt-16">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`safari-window-${index}`}
                className="h-24 rounded-2xl border border-gold-light bg-white/80 shadow-[0_8px_20px_rgba(0,0,0,0.05)]"
              />
            ))}
          </div>
        ) : (
          <div className="relative h-full p-8 pt-20">
            {!desktopVisible && (
              <>
                <div className="absolute left-8 top-20 h-28 w-[42%] rounded-[24px] border border-white/80 bg-white/78 shadow-[0_14px_32px_rgba(0,0,0,0.07)]" />
                <div className="absolute right-12 top-28 h-24 w-[36%] rounded-[24px] border border-white/80 bg-white/70 shadow-[0_14px_32px_rgba(0,0,0,0.07)]" />
                <div className="absolute left-20 bottom-14 h-24 w-[48%] rounded-[24px] border border-white/80 bg-white/74 shadow-[0_14px_32px_rgba(0,0,0,0.07)]" />
              </>
            )}

            <div className="absolute left-10 bottom-10 flex gap-5">
              {['截图.png', '下载', '项目'].map((label) => (
                <div key={label} className="text-center">
                  <div className="mx-auto mb-2 h-10 w-10 rounded-2xl bg-white/72 border border-white/70" />
                  <div className="text-[11px] font-light text-ink-secondary">{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SceneFrame>
  );
}

function PreviewGestureScene({
  activeState,
  title,
  description,
}: {
  activeState: string;
  title: string;
  description?: string;
}) {
  const zoomedImage = activeState === 'zoom-image';
  const rotatedImage = activeState === 'rotate-image';

  return (
    <SceneFrame title={title} description={description}>
      <div className="min-h-[260px] rounded-[26px] border border-border bg-[#FBFAF7] p-8">
        <div className="mx-auto flex h-[210px] max-w-[360px] items-center justify-center rounded-[28px] border border-border bg-white overflow-hidden">
          <div
            className={`relative h-[120px] w-[180px] rounded-[24px] bg-[linear-gradient(135deg,#D9E9F8_0%,#FBE8D0_100%)] shadow-[0_12px_24px_rgba(0,0,0,0.06)] transition-all duration-300 ${
              zoomedImage ? 'scale-[1.2]' : ''
            } ${rotatedImage ? 'rotate-12' : ''}`}
          >
            <div className="absolute inset-5 rounded-[18px] border border-white/65" />
          </div>
        </div>
      </div>
    </SceneFrame>
  );
}

function SystemGestureScene({
  activeState,
  title,
  description,
}: {
  activeState: string;
  title: string;
  description?: string;
}) {
  const forcePreview = activeState === 'force-preview';

  return (
    <SceneFrame title={title} description={description}>
      <div className="relative min-h-[260px] rounded-[26px] border border-border bg-[#FBFAF7] p-8">
        <div className="mx-auto max-w-[420px] rounded-[26px] border border-border bg-white p-6">
          <div className="mb-4 text-[12px] font-medium tracking-[0.04em] text-ink-tertiary">Safari 正在阅读</div>
          <div className="text-[26px] font-[var(--font-display)] font-[300] tracking-[-0.02em] text-ink mb-3">
            macOS 里的 Force Click
          </div>
          <div className="space-y-2">
            <div className="h-3 rounded-full bg-[#EDE9E1] w-[90%]" />
            <div className="h-3 rounded-full bg-[#EDE9E1] w-[82%]" />
            <div className="h-3 rounded-full bg-[#EDE9E1] w-[76%]" />
          </div>
        </div>

        {forcePreview && (
          <div className="absolute right-8 top-10 w-[220px] rounded-[22px] border border-gold-light bg-white shadow-[0_18px_42px_rgba(0,0,0,0.10)] p-4">
            <div className="text-[12px] font-medium text-gold-dim mb-2">Dictionary / Quick Look</div>
            <div className="text-[13px] font-light leading-relaxed text-ink-secondary">
              Force Click 会在当前上下文里直接给你更深一层的信息，不需要真正打开新页面。
            </div>
          </div>
        )}
      </div>
    </SceneFrame>
  );
}
