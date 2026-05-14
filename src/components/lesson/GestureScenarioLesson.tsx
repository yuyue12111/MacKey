'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, ChevronRight, RotateCcw, SkipForward } from 'lucide-react';
import type { GestureScenarioLessonConfig, GestureSimulationStep, Lesson } from '@/types/course';
import type { GestureSimulationInput, TrackpadGesture } from '@/types/gesture';
import { getAllGestures } from '@/lib/gestures';
import { matchGestureInput } from '@/lib/gesture-simulation';
import GestureReferenceCard from '@/components/gesture/GestureReferenceCard';
import TrackpadSimulator from '@/components/gesture/TrackpadSimulator';
import { useProgressStore } from '@/store/progress-store';
import ProgressBar from './ProgressBar';
import MarkdownContent from './MarkdownContent';
import GestureScenarioVisual from './scenarios/GestureScenarioVisual';

type Phase = 'prompting' | 'correct' | 'complete';

interface GestureScenarioLessonProps {
  lesson: Lesson;
  steps: GestureSimulationStep[];
  nextLessonUrl: string | null;
  currentLessonUrl: string;
  mode?: 'learn' | 'quiz';
  passThreshold?: number;
}

const allGestures = getAllGestures();

export default function GestureScenarioLesson({
  lesson,
  steps,
  nextLessonUrl,
  currentLessonUrl,
  mode = 'learn',
  passThreshold = 80,
}: GestureScenarioLessonProps) {
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const recordQuizScore = useProgressStore((s) => s.recordQuizScore);

  const [currentStep, setCurrentStep] = useState(0);
  const [phase, setPhase] = useState<Phase>('prompting');
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, boolean>>({});

  const phaseRef = useRef(phase);
  const currentStepRef = useRef(currentStep);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    };
  }, []);

  const gestureMap = useMemo(
    () => Object.fromEntries(allGestures.map((gesture) => [gesture.id, gesture])),
    []
  );
  const scenarioConfig = lesson.interactive?.config as GestureScenarioLessonConfig | undefined;
  const reviewTitle = scenarioConfig?.reviewTitleZh ?? '刚刚学会了什么';
  const reviewContent = scenarioConfig?.reviewContent;

  const step = steps[currentStep];
  const currentGesture = step ? gestureMap[step.acceptedGesture.gestureId] : undefined;

  const involvedGestures = useMemo(() => {
    const ids = new Set(lesson.gestureIds ?? []);
    for (const item of steps) {
      for (const gestureId of item.gestureIds) ids.add(gestureId);
      ids.add(item.acceptedGesture.gestureId);
      if (item.reviewGestureId) ids.add(item.reviewGestureId);
    }
    return Array.from(ids)
      .map((id) => gestureMap[id])
      .filter(Boolean) as TrackpadGesture[];
  }, [gestureMap, lesson.gestureIds, steps]);

  const totalCorrect = Object.values(results).filter(Boolean).length;
  const score = steps.length > 0 ? Math.round((totalCorrect / steps.length) * 100) : 0;
  const passed = score >= passThreshold;

  const reviewGestures = Array.from(
    new Set(
      Object.entries(results)
        .filter(([, ok]) => !ok)
        .map(([stepId]) => {
          const foundStep = steps.find((item) => item.id === stepId);
          return foundStep?.reviewGestureId ?? foundStep?.acceptedGesture.gestureId;
        })
        .filter(Boolean)
    )
  )
    .map((id) => gestureMap[id as string])
    .filter(Boolean) as TrackpadGesture[];

  const moveToNext = useCallback(() => {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    const nextIndex = currentStepRef.current + 1;
    if (nextIndex >= steps.length) {
      setPhase('complete');
      if (mode === 'quiz') {
        recordQuizScore(lesson.id, score);
      }
      return;
    }
    setCurrentStep(nextIndex);
    setPhase('prompting');
    setWrongAttempts(0);
    setErrorMessage(null);
  }, [lesson.id, mode, recordQuizScore, score, steps.length]);

  const handleSimulate = useCallback((input: GestureSimulationInput) => {
    if (!step || phaseRef.current !== 'prompting') return;

    const match = matchGestureInput(input, step.acceptedGesture, step.errorHints);
    if (!match.matched) {
      setWrongAttempts((value) => value + 1);
      setErrorMessage(match.reason?.messageZh ?? '这个动作还不对，再试一次。');
      setResults((prev) => ({
        ...prev,
        [step.id]: false,
      }));
      return;
    }

    setResults((prev) => ({
      ...prev,
      [step.id]: true,
    }));
    setErrorMessage(null);
    setPhase('correct');
    advanceTimerRef.current = setTimeout(() => {
      moveToNext();
    }, 2200);
  }, [moveToNext, step]);

  const handleCompleteLesson = useCallback(() => {
    completeLesson(lesson.id);
  }, [completeLesson, lesson.id]);

  if (phase === 'complete') {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="rounded-[28px] border border-border bg-surface p-8 md:p-10">
          <div className="mb-4 flex items-center gap-3 text-gold-dim">
            <CheckCircle2 size={24} strokeWidth={1.4} />
            <span className="text-sm font-medium">
              {mode === 'quiz' ? (passed ? '场景测验通过' : '场景测验已完成') : '场景练习完成'}
            </span>
          </div>

          <h2 className="font-[var(--font-display)] text-3xl font-[300] tracking-[-0.02em] text-ink">
            {mode === 'quiz' ? `得分 ${score} / 100` : '你已经在场景里练完本节手势'}
          </h2>
          <p className="mt-3 max-w-[620px] text-[14px] font-light leading-relaxed text-ink-secondary">
            {mode === 'quiz'
              ? passed
                ? '你已经能在任务语境中把这些手势用出来了。继续下一课，或者回到手势库做针对性复习。'
                : '这轮场景测验已经完成。先复习下面这些容易混淆的手势，再回来做一次，效果会更好。'
              : '你已经不是在“认手势名称”，而是在任务里把动作做了出来。下一课会把这些手势放进更复杂的场景里继续练。'}
          </p>

          {reviewGestures.length > 0 && (
            <div className="mt-6">
              <div className="mb-3 text-[13px] font-medium text-ink-secondary">建议优先复习</div>
              <div className="grid gap-3 md:grid-cols-2">
                {reviewGestures.map((gesture) => (
                  <GestureReferenceCard
                    key={gesture.id}
                    gesture={gesture}
                    compact
                    fromLessonUrl={currentLessonUrl}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleCompleteLesson}
              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#2D2D30]"
            >
              完成本课
            </button>

            {nextLessonUrl && (
              <Link
                href={nextLessonUrl}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-3 text-[14px] font-medium text-gold-dim no-underline transition-colors hover:border-gold-light hover:text-gold"
              >
                继续下一课 <ChevronRight size={16} strokeWidth={1.4} />
              </Link>
            )}

            <Link
              href={currentLessonUrl}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-3 text-[14px] font-medium text-ink-secondary no-underline transition-colors hover:border-gold-light hover:text-gold-dim"
            >
              <RotateCcw size={15} strokeWidth={1.4} />
              再练一次
            </Link>
          </div>
        </div>

        {reviewContent && (
          <div className="rounded-[28px] border border-border bg-surface px-6 py-7 md:px-8 md:py-8">
            <div className="mb-4 text-[12px] font-medium tracking-[0.04em] text-gold-dim">
              {reviewTitle}
            </div>
            <MarkdownContent content={reviewContent} />
          </div>
        )}

        <div>
          <div className="mb-4 text-[13px] font-medium text-ink-secondary">本节相关手势</div>
          <div className="grid gap-3 md:grid-cols-2">
            {involvedGestures.map((gesture) => (
              <GestureReferenceCard
                key={gesture.id}
                gesture={gesture}
                compact
                fromLessonUrl={currentLessonUrl}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {lesson.content && <MarkdownContent content={lesson.content} />}

      <ProgressBar current={currentStep + 1} total={steps.length} />

      {step && (
        <>
          <div className="rounded-[28px] border border-border bg-surface px-5 py-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(212,165,116,0.10)] text-sm font-medium text-gold-dim">
                {currentStep + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-medium tracking-[0.04em] text-gold-dim mb-1">
                  {step.sceneTitleZh}
                </div>
                <p className="text-[15px] font-light text-ink">{step.promptZh}</p>
              </div>
            </div>
          </div>

          {phase === 'correct' && (
            <div className="rounded-[24px] border border-gold-light bg-[#FFF8F0] px-5 py-4">
              <div className="text-[14px] font-medium text-ink">{step.successFeedbackZh}</div>
              {step.followupCopyZh && (
                <div className="mt-2 text-[13px] font-light leading-relaxed text-ink-secondary">
                  {step.followupCopyZh}
                </div>
              )}
            </div>
          )}

          <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
            <GestureScenarioVisual step={step} phase={phase} />
            <TrackpadSimulator
              key={step.id}
              acceptedGesture={step.acceptedGesture}
              onSimulate={handleSimulate}
              disabled={phase === 'correct'}
            />
          </div>

          {errorMessage && phase === 'prompting' && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-[#E9E2D7] bg-[#FBF8F4] px-5 py-4">
              <div>
                <div className="text-[14px] font-medium text-ink">还没成功</div>
                <div className="mt-1 text-[13px] font-light text-ink-secondary">
                  {errorMessage}
                </div>
              </div>
              {currentGesture && (
                <Link
                  href={`/gestures/${step.reviewGestureId ?? currentGesture.id}?from=${encodeURIComponent(currentLessonUrl)}`}
                  className="text-[13px] font-medium text-gold-dim no-underline transition-colors hover:text-gold"
                >
                  去复习这个手势
                </Link>
              )}
            </div>
          )}

          {wrongAttempts > 1 && phase === 'prompting' && (
            <div className="flex items-center justify-center gap-3">
              <p className="text-[13px] text-ink-tertiary font-light">
                已尝试 {wrongAttempts} 次，继续试一遍就会更顺手
              </p>
              <button
                type="button"
                onClick={moveToNext}
                className="inline-flex items-center gap-1 text-[12px] text-ink-tertiary hover:text-ink-secondary transition-colors font-light"
              >
                <SkipForward size={13} strokeWidth={1.2} />
                先看下一步
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
