'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { CheckCircle2, ChevronRight, SkipForward } from 'lucide-react';
import type { Shortcut } from '@/types/shortcut';
import type { Lesson } from '@/types/course';
import type { KeyCombo } from '@/hooks/useKeyDetector';
import { useKeyDetector } from '@/hooks/useKeyDetector';
import MacKeyboard from '@/components/keyboard/MacKeyboard';
import ShortcutBadge from '@/components/shortcut/ShortcutBadge';
import { useProgressStore } from '@/store/progress-store';
import { usePreferenceStore } from '@/store/preference-store';
import ProgressBar from './ProgressBar';
import ShortcutSummary from './ShortcutSummary';
import DangerWarning from './DangerWarning';

type Phase = 'prompting' | 'correct' | 'complete';

interface InteractiveLessonProps {
  mode: 'learn' | 'practice';
  lesson: Lesson;
  shortcuts: Shortcut[];
  nextLessonUrl: string | null;
}

const MODIFIER_SYMBOL_TO_CODE: Record<string, string> = {
  '⌘': 'MetaLeft',
  '⌥': 'AltLeft',
  '⌃': 'ControlLeft',
  '⇧': 'ShiftLeft',
  'Fn': 'Fn',
};

const TARGET_KEY_NAMES: Record<string, string> = {
  'ControlLeft': 'Control (⌃)',
  'AltLeft': 'Option (⌥)',
  'MetaLeft': 'Command (⌘)',
  'ShiftLeft': 'Shift (⇧)',
  'Fn': 'Fn',
};

function shortcutTargetCodes(shortcut: Shortcut): string[] {
  const codes: string[] = [];
  for (const mod of shortcut.combination.modifiers) {
    const c = MODIFIER_SYMBOL_TO_CODE[mod];
    if (c) codes.push(c);
  }
  codes.push(shortcut.combination.code);
  return codes;
}

function comboMatchesShortcut(combo: KeyCombo, shortcut: Shortcut): boolean {
  const targetMods = shortcut.combination.modifiers;
  const pressedMods = combo.modifiers;
  const modMatch =
    targetMods.length === pressedMods.length &&
    targetMods.every((m) => pressedMods.includes(m));
  const keyMatch = shortcut.combination.code === combo.code;
  return modMatch && keyMatch;
}

export default function InteractiveLesson({
  mode,
  lesson,
  shortcuts,
  nextLessonUrl,
}: InteractiveLessonProps) {
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const showWindows = usePreferenceStore((s) => s.showWindowsComparison);
  const interactiveConfig = lesson.interactive?.config as Record<string, unknown> | undefined;

  // Detect targetKeys exercise (for modifier key recognition)
  const targetKeys = useMemo(
    () => (interactiveConfig?.targetKeys as string[] | undefined) ?? [],
    [interactiveConfig]
  );
  const isTargetKeyExercise = shortcuts.length === 0 && targetKeys.length > 0;
  const itemCount = isTargetKeyExercise ? targetKeys.length : shortcuts.length;

  // State for rendering
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('prompting');
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [practicedIds, setPracticedIds] = useState<Set<string>>(new Set());
  const [completed, setCompleted] = useState(false);

  // Refs for stale-closure safety inside event callbacks
  const phaseRef = useRef<Phase>(phase);
  const currentIndexRef = useRef(currentIndex);
  const wrongAttemptsRef = useRef(wrongAttempts);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetRef = useRef<() => void>(() => {});
  const handleCorrectRef = useRef<(idx: number) => void>(() => {});

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);
  useEffect(() => {
    wrongAttemptsRef.current = wrongAttempts;
  }, [wrongAttempts]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    };
  }, []);

  const advanceToNext = useCallback(() => {
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    const nextIdx = currentIndexRef.current + 1;
    if (nextIdx >= itemCount) {
      setPhase('complete');
    } else {
      setCurrentIndex(nextIdx);
      setPhase('prompting');
      setWrongAttempts(0);
      setShowAnswer(false);
      resetRef.current();
    }
  }, [itemCount]);

  const handleCorrect = useCallback(
    (idx: number) => {
      setPhase('correct');
      if (mode === 'practice' && !isTargetKeyExercise) {
        setPracticedIds((prev) => new Set([...prev, shortcuts[idx].id]));
      }
      advanceTimerRef.current = setTimeout(() => {
        const nextIdx = idx + 1;
        if (nextIdx >= itemCount) {
          setPhase('complete');
        } else {
          setCurrentIndex(nextIdx);
          setPhase('prompting');
          setWrongAttempts(0);
          setShowAnswer(false);
          resetRef.current();
        }
      }, 2000);
    },
    [mode, shortcuts, isTargetKeyExercise, itemCount]
  );

  // Keep handleCorrectRef in sync so handleCombo can use it without stale closure
  useEffect(() => {
    handleCorrectRef.current = handleCorrect;
  }, [handleCorrect]);

  const handleCombo = useCallback((combo: KeyCombo) => {
    if (phaseRef.current !== 'prompting') return;
    const idx = currentIndexRef.current;
    const target = shortcuts[idx];
    if (!target) return;

    if (comboMatchesShortcut(combo, target)) {
      handleCorrectRef.current(idx);
    } else {
      const attempts = wrongAttemptsRef.current + 1;
      wrongAttemptsRef.current = attempts;
      setWrongAttempts(attempts);
    }
  }, [shortcuts]);

  const { pressedKeys, reset } = useKeyDetector({
    preventDefaults: true,
    onCombination: handleCombo,
    enabled: phase === 'prompting',
  });

  // Wire up reset ref after useKeyDetector provides the real reset function
  useEffect(() => {
    resetRef.current = reset;
  }, [reset]);

  // TargetKeys mode: detect individual key presses via useEffect
  useEffect(() => {
    if (!isTargetKeyExercise) return;
    if (phase !== 'prompting') return;
    const currentTargetCode = targetKeys[currentIndex];
    if (!currentTargetCode) return;

    if (pressedKeys.has(currentTargetCode)) {
      handleCorrectRef.current(currentIndex);
    }
  }, [isTargetKeyExercise, phase, currentIndex, targetKeys, pressedKeys]);

  const handleSkip = useCallback(() => {
    advanceToNext();
  }, [advanceToNext]);

  const handleComplete = useCallback(() => {
    completeLesson(lesson.id);
    setCompleted(true);
  }, [completeLesson, lesson.id]);

  // Compute which codes to highlight on the keyboard
  const highlightedCodes = useMemo(() => {
    if (phase === 'correct') {
      if (isTargetKeyExercise && targetKeys[currentIndex]) {
        return [targetKeys[currentIndex]];
      }
      if (shortcuts[currentIndex]) {
        return shortcutTargetCodes(shortcuts[currentIndex]);
      }
    }
    if (phase === 'prompting') {
      return Array.from(pressedKeys);
    }
    return [];
  }, [phase, currentIndex, shortcuts, pressedKeys, isTargetKeyExercise, targetKeys]);

  const currentShortcut = shortcuts[currentIndex];
  const currentTargetKeyName = isTargetKeyExercise
    ? TARGET_KEY_NAMES[targetKeys[currentIndex]] ?? targetKeys[currentIndex]
    : null;
  const isComplete = phase === 'complete';

  // ── Complete Phase ────────────────────────────────────────────
  if (isComplete) {
    if (isTargetKeyExercise) {
      return (
        <div className="animate-in fade-in duration-500 text-center">
          <CheckCircle2 size={48} className="text-gold mx-auto mb-4" strokeWidth={1.2} />
          <h2 className="font-[var(--font-display)] text-2xl font-[300] tracking-[-0.01em] mb-2">
            太棒了！
          </h2>
          <p className="text-[15px] text-ink-secondary font-light mb-8">
            你已经认识了 Mac 键盘上的 {targetKeys.length} 个修饰键
          </p>
          <button
            onClick={handleComplete}
            className="inline-flex items-center gap-2 bg-ink text-white px-6 py-2.5 rounded-full text-[14px] font-medium hover:bg-[#333] transition-colors"
          >
            <CheckCircle2 size={16} strokeWidth={1.5} />
            完成课程
          </button>
        </div>
      );
    }

    return (
      <ShortcutSummary
        shortcuts={shortcuts}
        lessonId={lesson.id}
        nextLessonUrl={completed ? nextLessonUrl : null}
      />
    );
  }

  // ── Practice Mode ─────────────────────────────────────────────
  if (mode === 'practice') {
    const practicedCount = practicedIds.size;
    const allDone = practicedCount >= shortcuts.length;

    return (
      <div>
        <DangerWarning />

        <ProgressBar current={practicedCount} total={shortcuts.length} />

        <div className="mb-6">
          <p className="text-[15px] text-ink-secondary font-light mb-1">
            自由练习：按下任意快捷键试试看
          </p>
          <p className="text-[13px] text-ink-tertiary font-light">
            已练习 {practicedCount}/{shortcuts.length} 个快捷键
          </p>
        </div>

        <div className="mb-8">
          <MacKeyboard
            highlightedKeys={highlightedCodes}
            showWindowsComparison={showWindows}
            readonly
          />
        </div>

        {/* Last matched feedback */}
        {phase === 'correct' && (
          <div className="animate-in fade-in duration-300 text-center mb-6">
            <CheckCircle2 size={24} className="text-gold mx-auto mb-2" strokeWidth={1.2} />
            {isTargetKeyExercise && currentTargetKeyName ? (
              <span className="font-[var(--font-display)] text-lg font-[400] tracking-[-0.01em]">
                {currentTargetKeyName}
              </span>
            ) : currentShortcut ? (
              <>
                <span className="font-[var(--font-display)] text-lg font-[400] tracking-[-0.01em]">
                  {currentShortcut.nameZh}
                </span>
                <p className="text-[13px] text-ink-tertiary font-light mt-1">
                  {currentShortcut.descriptionZh}
                </p>
              </>
            ) : null}
          </div>
        )}

        {wrongAttempts > 0 && phase === 'prompting' && (
          <p className="text-center text-[13px] text-ink-tertiary font-light mb-4">
            不对哦，再试试
          </p>
        )}

        {/* Practice checklist */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-8">
          {shortcuts.map((s) => {
            const practiced = practicedIds.has(s.id);
            return (
              <div
                key={s.id}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[13px] font-light transition-colors ${
                  practiced
                    ? 'border-gold-light bg-[#FFF8F0] text-ink'
                    : 'border-border text-ink-tertiary'
                }`}
              >
                {practiced ? (
                  <CheckCircle2 size={14} className="text-gold-dim shrink-0" strokeWidth={1.5} />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-border shrink-0" />
                )}
                <span>{s.nameZh}</span>
                <ShortcutBadge
                  modifiers={s.combination.modifiers}
                  keyName={s.combination.key}
                  size="sm"
                />
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <button
            onClick={() => setPhase('complete')}
            className="inline-flex items-center gap-2 bg-ink text-white px-6 py-2.5 rounded-full text-[14px] font-medium hover:bg-[#333] transition-colors"
          >
            {allDone ? '完成练习' : '结束练习'}
          </button>
        </div>
      </div>
    );
  }

  // ── Learn Mode ─────────────────────────────────────────────────
  return (
    <div>
      <DangerWarning />

      <ProgressBar current={currentIndex + 1} total={itemCount} />

      {/* PROMPTING phase */}
      {phase === 'prompting' && (
        <div className="text-center mb-6">
          {isTargetKeyExercise && currentTargetKeyName ? (
            <p className="text-[18px] text-ink font-light mb-2">
              请在键盘上按下
              <span className="font-[var(--font-display)] font-[400] text-gold-dim mx-1.5">
                {currentTargetKeyName}
              </span>
              键
            </p>
          ) : currentShortcut ? (
            <>
              <p className="text-[18px] text-ink font-light mb-2">
                请按下
                <span className="font-[var(--font-display)] font-[400] text-gold-dim mx-1.5">
                  「{currentShortcut.nameZh}」
                </span>
                的快捷键
              </p>
              <p className="text-[13px] text-ink-tertiary font-light">
                {currentShortcut.descriptionZh}
              </p>
            </>
          ) : null}
        </div>
      )}

      {/* CORRECT phase */}
      {phase === 'correct' && (
        <div className="animate-in fade-in duration-300 text-center mb-6">
          <CheckCircle2 size={40} className="text-gold mx-auto mb-3" strokeWidth={1.2} />
          {isTargetKeyExercise && currentTargetKeyName ? (
            <h3 className="font-[var(--font-display)] text-2xl font-[300] tracking-[-0.01em] mb-1">
              {currentTargetKeyName}
            </h3>
          ) : currentShortcut ? (
            <>
              <h3 className="font-[var(--font-display)] text-2xl font-[300] tracking-[-0.01em] mb-1">
                {currentShortcut.nameZh}
              </h3>
              <div className="mb-2">
                <ShortcutBadge
                  modifiers={currentShortcut.combination.modifiers}
                  keyName={currentShortcut.combination.key}
                  size="lg"
                />
              </div>
              <p className="text-[14px] text-ink-secondary font-light mb-3">
                {currentShortcut.descriptionZh}
              </p>
              {currentShortcut.tips && (
                <p className="text-[13px] text-gold-dim font-light">💡 {currentShortcut.tips}</p>
              )}
              {showWindows && currentShortcut.windowsEquivalent && (
                <p className="text-[12px] text-ink-tertiary font-light mt-2">
                  Windows:{' '}
                  <ShortcutBadge
                    modifiers={currentShortcut.windowsEquivalent.modifiers}
                    keyName={currentShortcut.windowsEquivalent.key}
                    size="sm"
                  />
                  {currentShortcut.windowsEquivalent.note && (
                    <span className="ml-1">({currentShortcut.windowsEquivalent.note})</span>
                  )}
                </p>
              )}
            </>
          ) : null}
          <button
            onClick={advanceToNext}
            className="mt-5 inline-flex items-center gap-1.5 text-[14px] text-gold-dim hover:text-gold transition-colors font-medium"
          >
            继续 <ChevronRight size={16} strokeWidth={1.2} />
          </button>
        </div>
      )}

      {/* Keyboard */}
      <div className="mb-6">
        <MacKeyboard
          highlightedKeys={highlightedCodes}
          showWindowsComparison={false}
          readonly
        />
      </div>

      {/* Wrong attempt feedback — only for shortcut exercises */}
      {!isTargetKeyExercise && wrongAttempts > 0 && phase === 'prompting' && (
        <p className="text-center text-[14px] text-ink-tertiary font-light mb-4">
          不对哦，再试一次
          {wrongAttempts >= 2 && (
            <span className="text-ink-secondary">
              {' '}
              · 已尝试 {wrongAttempts} 次
            </span>
          )}
        </p>
      )}

      {/* Hint after 3 wrong — only for shortcut exercises */}
      {!isTargetKeyExercise && wrongAttempts >= 3 && !showAnswer && phase === 'prompting' && currentShortcut && (
        <div className="text-center mb-4">
          <p className="text-[13px] text-ink-tertiary font-light mb-2">提示：试试组合键</p>
          <ShortcutBadge
            modifiers={currentShortcut.combination.modifiers}
            keyName={currentShortcut.combination.key}
          />
        </div>
      )}

      {/* Show answer — only for shortcut exercises */}
      {!isTargetKeyExercise && showAnswer && phase === 'prompting' && currentShortcut && (
        <div className="text-center mb-4">
          <p className="text-[13px] text-ink-tertiary font-light mb-2">答案是：</p>
          <ShortcutBadge
            modifiers={currentShortcut.combination.modifiers}
            keyName={currentShortcut.combination.key}
            size="lg"
          />
          {currentShortcut.windowsEquivalent && (
            <p className="text-[12px] text-ink-tertiary mt-2">
              Windows: {currentShortcut.windowsEquivalent.modifiers.join('+')}+
              {currentShortcut.windowsEquivalent.key}
            </p>
          )}
        </div>
      )}

      {/* Action buttons */}
      {phase === 'prompting' && (
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={handleSkip}
            className="inline-flex items-center gap-1 text-[13px] text-ink-tertiary hover:text-ink-secondary transition-colors font-light"
          >
            <SkipForward size={14} strokeWidth={1.2} />
            跳过
          </button>
          {!isTargetKeyExercise && wrongAttempts >= 3 && !showAnswer && (
            <button
              onClick={() => setShowAnswer(true)}
              className="text-[13px] text-gold-dim hover:text-gold transition-colors font-light"
            >
              显示答案
            </button>
          )}
        </div>
      )}
    </div>
  );
}
