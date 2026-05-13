'use client';

import { CheckCircle2, Clipboard, Scissors, Copy, ArrowRight } from 'lucide-react';
import type { Shortcut } from '@/types/shortcut';
import type { ScenarioStep } from '@/types/course';

interface TextEditorScenarioProps {
  step: ScenarioStep;
  phase: 'prompting' | 'correct' | 'complete';
  shortcuts: Shortcut[];
  stepIndex?: number;
  totalSteps?: number;
}

const SOURCE_TEXT = '杭州西湖，烟雨朦胧中的雷峰塔静静矗立，湖面上泛起层层涟漪。';
const ALT_TEXT = '断桥残雪，苏堤春晓，三潭印月——西湖十景，处处是诗。';

const CAT_VISUAL: Record<string, {
  source: boolean; target: boolean; sourceLabel?: string; targetLabel?: string;
  sourceText?: string; showClipboard?: boolean; cursorPos?: number;
}> = {
  copy: { source: true, target: false, sourceLabel: '选中的文本', showClipboard: true },
  paste: { source: false, target: true, targetLabel: '粘贴目标', showClipboard: true },
  cut: { source: true, target: true, sourceLabel: '源文本', targetLabel: '剪切目标' },
  'paste-match-style': { source: false, target: true, targetLabel: '粘贴并匹配样式' },
  undo: { source: false, target: true, targetLabel: '撤销结果', sourceText: SOURCE_TEXT },
  redo: { source: false, target: true, targetLabel: '重做结果', sourceText: ALT_TEXT },
  'select-all': { source: true, target: false, sourceLabel: '全选文本' },
  'cursor-word-left': { source: true, target: false, sourceLabel: '光标逐词左移', cursorPos: 3 },
  'cursor-word-right': { source: true, target: false, sourceLabel: '光标逐词右移', cursorPos: 18 },
  'select-word': { source: true, target: false, sourceLabel: '逐词选择', cursorPos: 14 },
  'delete-word': { source: true, target: false, sourceLabel: '逐词删除', cursorPos: 0 },
  'control-b': { source: true, target: false, sourceLabel: '⌃B 光标左移', cursorPos: 8 },
  'control-f': { source: true, target: false, sourceLabel: '⌃F 光标右移', cursorPos: 20 },
  'control-n': { source: true, target: false, sourceLabel: '⌃N 光标下移', cursorPos: 5 },
  'control-p': { source: true, target: false, sourceLabel: '⌃P 光标上移', cursorPos: 30 },
  'control-a': { source: true, target: false, sourceLabel: '⌃A 跳到行首', cursorPos: 0 },
  'control-e': { source: true, target: false, sourceLabel: '⌃E 跳到行尾', cursorPos: SOURCE_TEXT.length },
};

export default function TextEditorScenario({ step, phase }: TextEditorScenarioProps) {
  const visual = CAT_VISUAL[step.targetShortcutId] ?? { source: true, target: false };
  const isCorrect = phase === 'correct';
  const isCut = step.targetShortcutId === 'cut';
  const isPaste = step.targetShortcutId === 'paste' || step.targetShortcutId === 'paste-match-style';
  const hasCursor = visual.cursorPos !== undefined;
  const showClipboard = visual.showClipboard;

  return (
    <div className="bg-[#F5F3EF]">
      {/* macOS Window Chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#E8E6E1] border-b border-[#D8D6D0]">
        <span className="w-3 h-3 rounded-full bg-[#EC6A5E]" />
        <span className="w-3 h-3 rounded-full bg-[#F4BF4F]" />
        <span className="w-3 h-3 rounded-full bg-[#61C454]" />
        <span className="ml-2 text-[11px] text-ink-tertiary/60 font-light">文本编辑 — 未命名</span>
      </div>

      {/* Editor toolbar */}
      <div className="flex items-center gap-4 px-5 py-2 border-b border-[#E8E6E1] bg-white">
        <span className="text-[10px] text-ink-tertiary font-medium tracking-[0.04em]">文件</span>
        <span className="text-[10px] text-ink-tertiary font-medium tracking-[0.04em]">编辑</span>
        <span className="text-[10px] text-ink-tertiary font-medium tracking-[0.04em]">显示</span>
        <span className="text-[10px] text-ink-tertiary font-medium tracking-[0.04em]">格式</span>
      </div>

      {/* Editor body */}
      <div className="p-6 space-y-5 bg-white">
        {/* Source area */}
        {visual.source && (
          <div>
            <p className="text-[10px] text-ink-tertiary font-medium tracking-[0.05em] uppercase mb-2">
              {visual.sourceLabel ?? '文本内容'}
            </p>
            <div
              className={`relative rounded-lg border px-5 py-4 font-light leading-relaxed transition-all duration-500 ${
                isCorrect && !isCut
                  ? 'border-gold-light bg-[#FFF8F0] shadow-[0_0_0_4px_rgba(212,165,116,0.10)] scale-[1.01]'
                  : isCut && isCorrect
                    ? 'border-accent-red/15 bg-[#FAFAF8] opacity-25 scale-95'
                    : 'border-[#E8E6E1] bg-[#FAFAF8]'
              }`}
            >
              {/* Line numbers */}
              <div className="absolute left-0 top-0 bottom-0 w-8 border-r border-[#E8E6E1] flex flex-col items-center pt-4 text-[10px] text-ink-tertiary/40 font-mono">
                <span>1</span>
              </div>

              {/* Text content */}
              <div className="pl-5 text-[15px] text-ink">
                {hasCursor && visual.cursorPos !== undefined ? (
                  <span className="relative">
                    <span>{SOURCE_TEXT.slice(0, visual.cursorPos)}</span>
                    <span className={`inline-block w-0.5 h-[18px] align-middle -mt-0.5 rounded-full transition-all duration-300 ${
                      isCorrect ? 'bg-gold-dim opacity-0' : 'bg-gold-dim animate-pulse'
                    }`} />
                    <span>{SOURCE_TEXT.slice(visual.cursorPos)}</span>
                  </span>
                ) : (
                  <span>{SOURCE_TEXT}</span>
                )}

                {/* Selection highlight for select-all */}
                {step.targetShortcutId === 'select-all' && isCorrect && (
                  <span className="absolute inset-0 bg-gold-dim/10 rounded-lg" />
                )}
              </div>

              {/* Success badge */}
              {isCorrect && !isCut && (
                <span className="absolute -top-2.5 -right-2.5 flex items-center gap-1 bg-gold-dim text-white text-[11px] px-2.5 py-1 rounded-full shadow-md animate-in zoom-in duration-200">
                  <CheckCircle2 size={11} strokeWidth={2.5} />
                  {step.targetShortcutId === 'copy' && '已复制'}
                  {step.targetShortcutId === 'select-all' && '已全选'}
                  {(step.targetShortcutId === 'cursor-word-left' || step.targetShortcutId === 'cursor-word-right') && '光标已移动'}
                  {step.targetShortcutId === 'select-word' && '已选中'}
                  {step.targetShortcutId === 'delete-word' && '已删除'}
                  {step.targetShortcutId.startsWith('control-') && '到位！'}
                </span>
              )}

              {/* Cut indicator */}
              {isCut && isCorrect && (
                <p className="text-[13px] text-ink-tertiary font-light italic">此文本已被剪切到剪贴板</p>
              )}
            </div>
          </div>
        )}

        {/* Clipboard indicator */}
        {showClipboard && isCorrect && (
          <div className="flex items-center justify-center gap-2 animate-in slide-in-from-left-2 duration-300">
            <div className="flex items-center gap-2 bg-[#FFF8F0] border border-gold-light/50 rounded-full px-4 py-1.5">
              <Clipboard size={13} className="text-gold-dim" strokeWidth={1.2} />
              <span className="text-[12px] text-gold-dim font-light">剪贴板中有内容</span>
              <span className="text-[12px] text-gold-dim/50 font-mono">{SOURCE_TEXT.slice(0, 15)}…</span>
            </div>
            {visual.target && (
              <ArrowRight size={14} className="text-ink-tertiary/30" strokeWidth={1.2} />
            )}
          </div>
        )}

        {/* Icon indicators for copy/paste/cut flow */}
        {!isCorrect && showClipboard && (
          <div className="flex items-center justify-center gap-3 text-ink-tertiary/30">
            {step.targetShortcutId === 'copy' && (
              <div className="flex items-center gap-1.5 text-[11px] font-light">
                <Copy size={13} strokeWidth={1.2} /> 按下快捷键复制文本到剪贴板
              </div>
            )}
            {step.targetShortcutId === 'cut' && (
              <div className="flex items-center gap-1.5 text-[11px] font-light">
                <Scissors size={13} strokeWidth={1.2} /> 按下快捷键剪切文本到剪贴板
              </div>
            )}
            {isPaste && (
              <div className="flex items-center gap-1.5 text-[11px] font-light">
                <Clipboard size={13} strokeWidth={1.2} /> 按下快捷键将剪贴板内容粘贴到下方
              </div>
            )}
          </div>
        )}

        {/* Target area */}
        {visual.target && (
          <div>
            <p className="text-[10px] text-ink-tertiary font-medium tracking-[0.05em] uppercase mb-2">
              {visual.targetLabel ?? '目标区域'}
            </p>
            <div
              className={`rounded-lg border-2 border-dashed px-5 py-4 font-light leading-relaxed transition-all duration-500 ${
                isCorrect && isPaste
                  ? 'border-gold-light bg-[#FFF8F0] text-ink scale-[1.01]'
                  : isCorrect
                    ? 'border-gold-light/40 bg-[#FAFAF8]'
                    : 'border-[#D8D6D0] bg-[#FAFAF8]'
              }`}
            >
              {/* Line number */}
              <div className="absolute left-0 top-0 bottom-0 w-8 border-r border-[#E8E6E1] flex flex-col items-center pt-4 text-[10px] text-ink-tertiary/40 font-mono">
                <span>2</span>
              </div>

              <div className="pl-5 text-[15px] min-h-[24px]">
                {isCorrect && isPaste ? (
                  <span className="animate-in fade-in slide-in-from-top-1 duration-500 text-ink">
                    {SOURCE_TEXT}
                  </span>
                ) : isCorrect ? (
                  <span className="text-ink animate-in fade-in duration-300">
                    {step.targetShortcutId === 'undo' ? '已撤销，文字恢复原样' : '已完成'}
                  </span>
                ) : (
                  <span className="text-ink-tertiary/35 italic">在此处粘贴...</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-5 py-1.5 bg-[#F5F3EF] border-t border-[#E8E6E1] text-[10px] text-ink-tertiary/50 font-mono">
        <span>纯文本 · UTF-8</span>
        <span>第 1 行，第 {visual.cursorPos ?? 0} 列</span>
      </div>
    </div>
  );
}
