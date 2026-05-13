'use client';

import type { Shortcut } from '@/types/shortcut';
import type { ScenarioStep } from '@/types/course';
import {
  Monitor, Crop, SquareDashed, MousePointer2, Columns2,
  Camera, Clipboard, Image,
} from 'lucide-react';

interface ScreenshotScenarioProps {
  step: ScenarioStep;
  phase: 'prompting' | 'correct' | 'complete';
  shortcuts: Shortcut[];
}

export default function ScreenshotScenario({ step, phase }: ScreenshotScenarioProps) {
  const sid = step.targetShortcutId;
  const isCorrect = phase === 'correct';
  const isFullscreen = sid === 'screenshot-full';
  const isArea = sid === 'screenshot-area';
  const isTool = sid === 'screenshot-tool';
  const isClipboard = sid === 'screenshot-clipboard';

  return (
    <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
      {/* Screen content */}
      <div
        className={`relative bg-gradient-to-b from-[#1A1A2E] via-[#16213E] to-[#0F3460] min-h-[260px] flex items-center justify-center transition-all duration-300 ${
          isFullscreen && isCorrect ? 'animate-in zoom-in duration-300' : ''
        }`}
      >
        {/* Screen flash on full screenshot */}
        {isCorrect && isFullscreen && (
          <div className="absolute inset-0 bg-white animate-in fade-in duration-150 z-20" />
        )}

        {/* Mock desktop content */}
        <div className="text-center">
          <Monitor size={48} className="text-white/20 mx-auto mb-4" strokeWidth={1} />
          <div className="flex items-center gap-4">
            <div className="w-16 h-10 rounded-lg bg-white/10 border border-white/10" />
            <div className="w-16 h-10 rounded-lg bg-white/10 border border-white/10" />
            <div className="w-16 h-10 rounded-lg bg-white/10 border border-white/10" />
          </div>
          <p className="text-white/20 text-[11px] font-light mt-4">模拟屏幕内容</p>
        </div>

        {/* Area selection overlay */}
        {isArea && (
          <div
            className={`absolute z-10 transition-all duration-300 ${
              isCorrect
                ? 'border-2 border-gold shadow-[0_0_0_9999px_rgba(0,0,0,0.2)]'
                : 'border border-dashed border-white/30 shadow-[0_0_0_9999px_rgba(0,0,0,0.15)] bg-white/5'
            }`}
            style={{
              left: '20%',
              top: '15%',
              width: '60%',
              height: '65%',
            }}
          >
            {isCorrect && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gold-dim text-white text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap animate-in fade-in duration-200">
                <Camera size={10} className="inline mr-1" />
                已截取此区域
              </div>
            )}
            {/* Corner handles */}
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-white/40" />
            <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-white/40" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-white/40" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-white/40" />
          </div>
        )}

        {/* Screenshot toolbar */}
        {isTool && (
          <div
            className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-10 transition-all duration-300 ${
              isCorrect ? 'opacity-100' : 'opacity-70'
            }`}
          >
            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-2 shadow-lg">
              {[
                { icon: Monitor, label: '全屏', active: false },
                { icon: SquareDashed, label: '窗口', active: false },
                { icon: Crop, label: '区域', active: true },
                { icon: Columns2, label: '录屏', active: false },
              ].map((btn) => (
                <div
                  key={btn.label}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[10px] font-light transition-colors ${
                    btn.active ? 'bg-gold-dim/20 text-gold-dim' : 'text-white/60'
                  }`}
                >
                  <btn.icon size={16} strokeWidth={1.2} />
                  {btn.label}
                </div>
              ))}
            </div>
            {isCorrect && (
              <p className="text-center text-white/70 text-[11px] font-light mt-2 animate-in fade-in">
                截图工具栏已打开，点击上方按钮选择截图模式
              </p>
            )}
          </div>
        )}

        {/* Clipboard indicator */}
        {isClipboard && (
          <div
            className={`absolute bottom-8 right-8 z-10 transition-all duration-300 ${
              isCorrect ? 'scale-100 opacity-100' : 'scale-90 opacity-60'
            }`}
          >
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-2.5 shadow-lg">
              <Clipboard size={14} className={isCorrect ? 'text-gold-dim' : 'text-white/40'} />
              <span className="text-[12px] text-white/80 font-light">
                {isCorrect ? '截图已复制到剪贴板 ✓' : '截图 → 剪贴板'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Thumbnail corner */}
      {(isCorrect && (isFullscreen || isArea || isClipboard)) && (
        <div className="border-t border-border-light bg-[#FAFAF8] p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-9 rounded-lg bg-white border border-border flex items-center justify-center animate-in zoom-in duration-200">
              <Image size={16} className="text-ink-tertiary/40" strokeWidth={1.2} />
            </div>
            <div>
              <p className="text-[12px] text-ink font-light">
                {isFullscreen ? '截屏 2026-05-13 14:30:00.png' : '截屏 2026-05-13 14:30:05.png'}
              </p>
              <p className="text-[11px] text-ink-tertiary font-light">
                已保存到桌面
                {isClipboard && (
                  <span className="text-gold-dim ml-2">· 同时保存在剪贴板</span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
