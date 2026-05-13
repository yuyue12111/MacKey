'use client';

import type { Shortcut } from '@/types/shortcut';
import type { ScenarioStep } from '@/types/course';
import { Globe, FileText, MessageSquare, Settings, Terminal, Search, Layers } from 'lucide-react';

interface DesktopScenarioProps {
  step: ScenarioStep;
  phase: 'prompting' | 'correct' | 'complete';
  shortcuts: Shortcut[];
}

interface WinState {
  id: string; name: string; icon: React.ReactNode;
  x: number; y: number; w: number; h: number;
  visible: boolean; focused: boolean; fullscreen: boolean;
}

function getInitialWindows(): WinState[] {
  return [
    { id: 'safari', name: 'Safari', icon: <Globe size={18} strokeWidth={1.2} />, x: 15, y: 15, w: 140, h: 100, visible: true, focused: true, fullscreen: false },
    { id: 'notes', name: '备忘录', icon: <FileText size={18} strokeWidth={1.2} />, x: 130, y: 50, w: 140, h: 100, visible: true, focused: false, fullscreen: false },
    { id: 'messages', name: '信息', icon: <MessageSquare size={18} strokeWidth={1.2} />, x: 80, y: 90, w: 140, h: 100, visible: true, focused: false, fullscreen: false },
  ];
}

const DOCK_APPS = [
  { name: '访达', icon: '📁' },
  { name: 'Safari', icon: '🧭' },
  { name: '备忘录', icon: '📝' },
  { name: '信息', icon: '💬' },
  { name: '终端', icon: '💻' },
  { name: '系统设置', icon: '⚙' },
];

export default function DesktopScenario({ step, phase }: DesktopScenarioProps) {
  const sid = step.targetShortcutId;
  const isCorrect = phase === 'correct';
  const windows = getInitialWindows();

  // Compute visual state based on step
  const spotlightOpen = sid === 'spotlight' && isCorrect;
  const appSwitching = sid === 'switch-app' && isCorrect;
  const missionControl = sid === 'mission-control' && isCorrect;
  const safariClosed = (sid === 'close-window' || sid === 'quit-app') && isCorrect;
  const safariHidden = sid === 'hide-app' && isCorrect;
  const othersHidden = sid === 'hide-others' && isCorrect;
  const safariFullscreen = sid === 'fullscreen' && isCorrect;
  const statusMsg = (sid === 'save' || sid === 'find' || sid === 'preferences' || sid === 'new-window' || sid === 'new-tab') && isCorrect;

  return (
    <div className="bg-gradient-to-b from-[#2C5F8A] via-[#3A7BBF] to-[#4A90D9] min-h-[320px] relative overflow-hidden">
      {/* Wallpaper subtle pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }}
      />

      {/* Menu bar */}
      <div className="relative z-30 flex items-center gap-4 px-4 py-1.5 bg-black/20 backdrop-blur-sm text-white/80 text-[10px] font-light">
        <span className="font-bold">🍎</span>
        <span>访达</span>
        <span>文件</span>
        <span>编辑</span>
        <span>显示</span>
        <span>前往</span>
        <span>窗口</span>
        <span>帮助</span>
        <span className="ml-auto flex items-center gap-2">
          <span>🔋 100%</span>
          <span>📶</span>
          <span>{new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
        </span>
      </div>

      <div className="relative z-10 p-4">
        {/* Windows */}
        {windows.map((win) => {
          const isSafari = win.id === 'safari';
          const isNotes = win.id === 'notes';
          const shouldHide = (safariClosed && isSafari) || (safariHidden && isSafari) || (othersHidden && !isNotes);
          const shouldFullscreen = safariFullscreen && isSafari;

          return (
            <div
              key={win.id}
              className={`absolute rounded-xl border border-white/10 bg-white/95 shadow-lg transition-all duration-700 ease-out ${
                missionControl ? 'scale-[0.35] opacity-60 -translate-y-10' :
                shouldFullscreen ? '!left-0 !top-0 !w-full !h-[280px]' :
                shouldHide ? 'opacity-0 scale-90' :
                win.focused ? 'ring-1 ring-white/30' : ''
              }`}
              style={{
                left: shouldFullscreen ? 0 : win.x,
                top: shouldFullscreen ? 0 : win.y,
                width: shouldFullscreen ? '100%' : win.w,
                height: shouldFullscreen ? '100%' : win.h,
              }}
            >
              {/* Window title bar */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-black/5 bg-gradient-to-b from-[#F5F3EF] to-[#E8E6E1]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EC6A5E]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#F4BF4F]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#61C454]" />
                <span className="ml-auto text-[9px] text-ink-tertiary/50 font-light">{win.name}</span>
              </div>
              {/* Window content */}
              <div className="p-3 flex items-center justify-center h-[calc(100%-28px)] text-ink-tertiary/20">
                {win.icon}
              </div>
            </div>
          );
        })}

        {/* Mission Control overlay */}
        {missionControl && (
          <div className="absolute inset-0 z-20 flex items-center justify-center gap-4 bg-black/10 backdrop-blur-[1px] animate-in fade-in duration-300">
            {windows.map((win) => (
              <div key={win.id} className="w-[100px] h-[70px] rounded-lg border border-white/20 bg-white/90 shadow-lg flex items-center justify-center animate-in zoom-in-95 duration-300">
                {win.icon}
              </div>
            ))}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-2">
              <div className="w-16 h-8 rounded-md border border-white/20 bg-white/40 backdrop-blur-sm" />
              <div className="w-16 h-8 rounded-md border border-white/20 bg-white/40 backdrop-blur-sm" />
            </div>
          </div>
        )}

        {/* Spotlight overlay */}
        {spotlightOpen && (
          <div className="absolute inset-0 z-20 flex items-start justify-center pt-16 bg-black/10 backdrop-blur-[2px] animate-in fade-in duration-300">
            <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl px-5 py-4 w-[360px] flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
              <Search size={20} className="text-ink-tertiary" strokeWidth={1.2} />
              <input type="text" placeholder="Spotlight 搜索" className="flex-1 bg-transparent text-[16px] text-ink font-light outline-none" readOnly />
            </div>
          </div>
        )}

        {/* App Switcher overlay */}
        {appSwitching && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/15 backdrop-blur-[2px] animate-in fade-in duration-200">
            <div className="flex items-center gap-4 bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg px-6 py-3 animate-in zoom-in-95 duration-200">
              {DOCK_APPS.slice(0, 5).map((app, i) => (
                <div key={app.name} className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${i === 1 ? 'bg-white/80 ring-2 ring-gold-light shadow-sm' : ''}`}>
                  <span className="text-xl">{app.icon}</span>
                  <span className="text-[10px] text-ink-secondary font-light">{app.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status messages */}
        {statusMsg && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center animate-in fade-in zoom-in duration-300">
            <div className="bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-3 shadow-lg">
              <p className="text-[15px] text-white font-light drop-shadow-sm">
                {sid === 'save' && '文件已保存 ✓'}
                {sid === 'find' && '查找栏已打开 ✓'}
                {sid === 'preferences' && '偏好设置已打开 ✓'}
                {sid === 'new-window' && '新窗口已创建 ✓'}
                {sid === 'new-tab' && '新标签页已打开 ✓'}
              </p>
            </div>
          </div>
        )}

        {/* Window closed / hidden indicator */}
        {(safariClosed || safariHidden) && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center animate-in fade-in duration-500">
            <div className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 shadow-lg space-y-1">
              <p className="text-[15px] text-ink font-light">
                {sid === 'close-window' && 'Safari 窗口已关闭'}
                {sid === 'quit-app' && 'Safari 已完全退出'}
                {sid === 'hide-app' && 'Safari 已隐藏'}
              </p>
              <p className="text-[12px] text-ink-tertiary font-light">
                {sid === 'close-window' && '窗口关闭了，但应用仍在后台运行'}
                {sid === 'quit-app' && '应用已从内存中移除，Dock 栏亮点消失'}
                {sid === 'hide-app' && '窗口暂时隐藏，⌘Tab 可以切回来'}
              </p>
              {sid === 'close-window' && (
                <p className="text-[11px] text-gold-dim font-light">💡 Mac 上关闭窗口 ≠ 退出应用</p>
              )}
            </div>
          </div>
        )}

        {/* Others hidden indicator */}
        {othersHidden && !safariHidden && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center animate-in fade-in duration-500">
            <div className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 shadow-lg">
              <p className="text-[15px] text-ink font-light">其他所有应用已隐藏</p>
              <p className="text-[12px] text-ink-tertiary font-light">只剩备忘录窗口在屏幕上</p>
              <p className="text-[11px] text-gold-dim font-light mt-1">💡 专注模式利器</p>
            </div>
          </div>
        )}

        {/* Fullscreen indicator */}
        {safariFullscreen && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center animate-in fade-in duration-500">
            <div className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 shadow-lg">
              <p className="text-[15px] text-ink font-light">Safari 已进入全屏模式</p>
              <p className="text-[12px] text-ink-tertiary font-light">菜单栏和 Dock 自动隐藏</p>
            </div>
          </div>
        )}
      </div>

      {/* Dock bar */}
      {!missionControl && !safariFullscreen && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 flex items-end gap-1 bg-white/25 backdrop-blur-xl border border-white/20 rounded-2xl px-3 pt-2 pb-1.5 shadow-lg">
          {DOCK_APPS.map((app) => (
            <div key={app.name} className="flex flex-col items-center gap-1 px-2 group" title={app.name}>
              <span className="text-xl transition-transform group-hover:-translate-y-2 group-hover:scale-110 duration-200">{app.icon}</span>
              {app.name === 'Safari' && !safariClosed && (
                <span className="w-1 h-1 rounded-full bg-white/70" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
