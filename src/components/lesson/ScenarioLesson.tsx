'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { CheckCircle2, ChevronRight, SkipForward, ChevronDown, ChevronUp, Keyboard } from 'lucide-react';
import type { Shortcut } from '@/types/shortcut';
import type { Lesson, ScenarioStep } from '@/types/course';
import type { KeyCombo } from '@/hooks/useKeyDetector';
import { useKeyDetector } from '@/hooks/useKeyDetector';
import MacKeyboard from '@/components/keyboard/MacKeyboard';
import ShortcutBadge from '@/components/shortcut/ShortcutBadge';
import { useProgressStore } from '@/store/progress-store';
import ProgressBar from './ProgressBar';
import DangerWarning from './DangerWarning';
import ShortcutSummary from './ShortcutSummary';

type Phase = 'prompting' | 'correct' | 'complete';

interface ScenarioLessonProps {
  lesson: Lesson;
  scenarioType: string;
  steps: ScenarioStep[];
  shortcuts: Shortcut[];
  nextLessonUrl: string | null;
  streamlined?: boolean;
  onComplete?: () => void;
}

function getShortcutByCode(shortcuts: Shortcut[], step: ScenarioStep): Shortcut | undefined {
  return shortcuts.find((s) => s.id === step.targetShortcutId);
}

function comboMatchesShortcut(combo: KeyCombo, shortcut: Shortcut): boolean {
  const targetMods = shortcut.combination.modifiers;
  const pressedMods = combo.modifiers;
  return (
    targetMods.length === pressedMods.length &&
    targetMods.every((m) => pressedMods.includes(m)) &&
    shortcut.combination.code === combo.code
  );
}

export default function ScenarioLesson({
  lesson,
  scenarioType,
  steps,
  shortcuts,
  nextLessonUrl,
  streamlined = false,
  onComplete,
}: ScenarioLessonProps) {
  const completeLesson = useProgressStore((s) => s.completeLesson);

  const [currentStep, setCurrentStep] = useState(0);
  const [phase, setPhase] = useState<Phase>('prompting');
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  const phaseRef = useRef<Phase>(phase);
  const currentStepRef = useRef(currentStep);
  const wrongAttemptsRef = useRef(wrongAttempts);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetRef = useRef<() => void>(() => {});
  const handleCorrectRef = useRef<(idx: number) => void>(() => {});

  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { currentStepRef.current = currentStep; }, [currentStep]);
  useEffect(() => { wrongAttemptsRef.current = wrongAttempts; }, [wrongAttempts]);

  useEffect(() => {
    return () => { if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current); };
  }, []);

  const advanceToNext = useCallback(() => {
    if (advanceTimerRef.current) { clearTimeout(advanceTimerRef.current); advanceTimerRef.current = null; }
    const nextIdx = currentStepRef.current + 1;
    if (nextIdx >= steps.length) { setPhase('complete'); } else {
      setCurrentStep(nextIdx); setPhase('prompting'); setWrongAttempts(0); resetRef.current();
    }
  }, [steps.length]);

  const handleCorrect = useCallback((idx: number) => {
    setPhase('correct');
    advanceTimerRef.current = setTimeout(() => {
      const nextIdx = idx + 1;
      if (nextIdx >= steps.length) { setPhase('complete'); } else {
        setCurrentStep(nextIdx); setPhase('prompting'); setWrongAttempts(0); resetRef.current();
      }
    }, 3000);
  }, [steps.length]);

  useEffect(() => { handleCorrectRef.current = handleCorrect; }, [handleCorrect]);

  const handleCombo = useCallback((combo: KeyCombo) => {
    if (phaseRef.current !== 'prompting') return;
    const idx = currentStepRef.current;
    const step = steps[idx];
    if (!step) return;
    const target = getShortcutByCode(shortcuts, step);
    if (!target) return;
    if (comboMatchesShortcut(combo, target)) { handleCorrectRef.current(idx); } else {
      const attempts = wrongAttemptsRef.current + 1; wrongAttemptsRef.current = attempts; setWrongAttempts(attempts);
    }
  }, [steps, shortcuts]);

  const { pressedKeys, reset } = useKeyDetector({
    preventDefaults: true, onCombination: handleCombo, enabled: phase === 'prompting',
  });

  useEffect(() => { resetRef.current = reset; }, [reset]);

  const step = steps[currentStep];
  const targetShortcut = step ? getShortcutByCode(shortcuts, step) : undefined;

  const highlightedCodes = useMemo(() => {
    if (phase === 'correct' && targetShortcut) {
      const codes = targetShortcut.combination.modifiers.map((m) => {
        const map: Record<string, string> = { '⌘': 'MetaLeft', '⌥': 'AltLeft', '⌃': 'ControlLeft', '⇧': 'ShiftLeft', 'Fn': 'Fn' };
        return map[m] ?? '';
      }).filter(Boolean);
      codes.push(targetShortcut.combination.code);
      return codes;
    }
    return Array.from(pressedKeys);
  }, [phase, targetShortcut, pressedKeys]);

  const handleSkip = useCallback(() => advanceToNext(), [advanceToNext]);
  const handleComplete = useCallback(() => {
    completeLesson(lesson.id);
    setCompleted(true);
    onComplete?.();
  }, [completeLesson, lesson.id, onComplete]);

  if (phase === 'complete') {
    if (streamlined) {
      return (
        <div className="text-center py-8 animate-in fade-in duration-500">
          <CheckCircle2 size={48} className="text-gold mx-auto mb-4" strokeWidth={1.2} />
          <h2 className="font-[var(--font-display)] text-2xl font-[300] tracking-[-0.01em] mb-2">
            本组完成
          </h2>
          <p className="text-[15px] text-ink-secondary font-light mb-6">
            已掌握 {shortcuts.length} 个快捷键
          </p>
          <button
            onClick={handleComplete}
            className="inline-flex items-center gap-2 bg-ink text-white px-6 py-2.5 rounded-full text-[14px] font-medium hover:bg-[#333] transition-colors"
          >
            <CheckCircle2 size={16} strokeWidth={1.5} />
            {onComplete ? '继续' : '完成课程'}
          </button>
        </div>
      );
    }
    return <ShortcutSummary shortcuts={shortcuts} lessonId={lesson.id} nextLessonUrl={completed ? nextLessonUrl : null} />;
  }

  return (
    <div className={streamlined ? 'space-y-4' : 'space-y-5'}>
      {!streamlined && <DangerWarning />}
      <ProgressBar current={currentStep + 1} total={steps.length} />

      {/* Scene intro — only in normal mode */}
      {!streamlined && (
        <div className="bg-[#FFF8F0] border border-gold-light/50 rounded-xl px-5 py-3 flex items-start gap-3">
          <span className="text-base shrink-0 mt-0.5">💡</span>
          <div>
            <p className="text-[13px] text-ink-secondary font-light leading-relaxed">
              请按照提示按下对应的快捷键，观察场景中的变化。
            </p>
            <p className="text-[12px] text-gold-dim font-light mt-1">
              在真实键盘上按下提示的组合键
            </p>
          </div>
        </div>
      )}

      {/* ── Step Instruction ──────────────────────────────────────── */}
      {phase === 'prompting' && step && (
        <div className={`flex items-center gap-3 rounded-2xl px-5 py-4 shadow-sm transition-all duration-300 ${
          streamlined ? 'bg-surface border border-border' : 'bg-surface border border-border'
        }`}>
          {!streamlined && (
            <div className="w-8 h-8 rounded-full bg-[rgba(212,165,116,0.10)] flex items-center justify-center text-gold-dim text-sm font-medium shrink-0">
              {currentStep + 1}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className={streamlined ? 'text-[20px] text-ink font-light' : 'text-[15px] text-ink font-light'}>
              {step.prompt}
            </p>
          </div>
          {targetShortcut && (
            <ShortcutBadge modifiers={targetShortcut.combination.modifiers} keyName={targetShortcut.combination.key} size={streamlined ? 'lg' : 'md'} />
          )}
        </div>
      )}

      {/* Correct feedback */}
      {phase === 'correct' && step && (
        <div className="flex items-center gap-3 bg-[#F8F6F0] border border-gold-light rounded-2xl px-5 py-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle2 size={24} className="text-gold shrink-0" strokeWidth={1.2} />
          <div className="flex-1 min-w-0">
            <p className="text-[15px] text-ink font-light">{step.feedback}</p>
          </div>
          {!streamlined && (
            <button
              onClick={advanceToNext}
              className="inline-flex items-center gap-1 text-[13px] text-gold-dim hover:text-gold transition-colors font-medium shrink-0"
            >
              继续 <ChevronRight size={14} strokeWidth={1.2} />
            </button>
          )}
        </div>
      )}

      {/* ── Scenario Visual ──────────────────────────────────────── */}
      <div className={`overflow-hidden ${streamlined ? 'rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.06)]' : 'rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.04)]'}`}>
        <ScenarioVisual type={scenarioType} step={step} phase={phase} shortcuts={shortcuts} stepIndex={currentStep} totalSteps={steps.length} />
      </div>

      {/* Keyboard — always visible in streamlined mode */}
      {streamlined ? (
        <div className="bg-surface border border-border rounded-2xl p-3">
          <MacKeyboard highlightedKeys={highlightedCodes} showWindowsComparison={false} readonly />
        </div>
      ) : (
        <div>
          <button
            onClick={() => setKeyboardOpen(!keyboardOpen)}
            className="flex items-center gap-2 text-[12px] text-ink-tertiary hover:text-ink-secondary transition-colors font-light mb-2"
          >
            <Keyboard size={14} strokeWidth={1.2} />
            虚拟键盘
            {keyboardOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          {keyboardOpen && (
            <div className="bg-surface border border-border rounded-2xl p-4 animate-in slide-in-from-top-2 duration-200">
              <MacKeyboard highlightedKeys={highlightedCodes} showWindowsComparison={false} readonly />
            </div>
          )}
        </div>
      )}

      {/* Wrong feedback — minimal in streamlined mode */}
      {wrongAttempts > 0 && phase === 'prompting' && (
        <div className="flex items-center justify-center gap-3">
          <p className="text-[13px] text-ink-tertiary font-light">不对哦，再试一次</p>
          <button onClick={handleSkip} className="inline-flex items-center gap-1 text-[12px] text-ink-tertiary hover:text-ink-secondary transition-colors font-light">
            <SkipForward size={13} strokeWidth={1.2} /> 跳过
          </button>
        </div>
      )}
    </div>
  );
}

// ── Scenario Visual proxy ────────────────────────────────────────
import TextEditorScenario from './scenarios/TextEditorScenario';
import DesktopScenario from './scenarios/DesktopScenario';
import FinderScenario from './scenarios/FinderScenario';
import ScreenshotScenario from './scenarios/ScreenshotScenario';

function ScenarioVisual({
  type, step, phase, shortcuts, stepIndex, totalSteps,
}: {
  type: string;
  step: ScenarioStep | undefined;
  phase: Phase;
  shortcuts: Shortcut[];
  stepIndex?: number;
  totalSteps?: number;
}) {
  if (!step) return null;

  switch (type) {
    case 'text-editor':
      return <TextEditorScenario step={step} phase={phase} shortcuts={shortcuts} stepIndex={stepIndex} totalSteps={totalSteps} />;
    case 'desktop':
      return <DesktopScenario step={step} phase={phase} shortcuts={shortcuts} />;
    case 'finder':
      return <FinderScenario step={step} phase={phase} shortcuts={shortcuts} />;
    case 'screenshot':
      return <ScreenshotScenario step={step} phase={phase} shortcuts={shortcuts} />;
    default:
      return null;
  }
}
