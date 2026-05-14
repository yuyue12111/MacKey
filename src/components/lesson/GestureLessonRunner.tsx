'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { CheckCircle2, ChevronRight, RotateCcw } from 'lucide-react';
import type { GestureQuestion, Lesson } from '@/types/course';
import type { TrackpadGesture } from '@/types/gesture';
import { getAllGestures, getGestureDirectionLabel, GESTURE_TYPE_LABELS } from '@/lib/gestures';
import TrackpadGestureDemo from '@/components/gesture/TrackpadGestureDemo';
import GestureReferenceCard from '@/components/gesture/GestureReferenceCard';
import MarkdownContent from './MarkdownContent';

interface GestureLessonRunnerProps {
  lesson: Lesson;
  nextLessonUrl: string | null;
  currentLessonUrl: string;
  questions: GestureQuestion[];
  mode: 'learn' | 'quiz';
  passThreshold?: number;
}

const allGestures = getAllGestures();

export default function GestureLessonRunner({
  lesson,
  nextLessonUrl,
  currentLessonUrl,
  questions,
  mode,
  passThreshold = 80,
}: GestureLessonRunnerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedGestureId, setSelectedGestureId] = useState<string | null>(null);
  const [completedAnswers, setCompletedAnswers] = useState<Record<string, boolean>>({});

  const question = questions[currentIndex];
  const gestureMap = useMemo(
    () => Object.fromEntries(allGestures.map((gesture) => [gesture.id, gesture])),
    []
  );

  const correctGesture = question ? gestureMap[question.gestureId] : undefined;
  const isAnswered = selectedGestureId !== null;
  const isCorrect = isAnswered && selectedGestureId === question?.gestureId;

  const involvedGestures = useMemo(() => {
    const ids = new Set(lesson.gestureIds ?? []);
    for (const item of questions) {
      ids.add(item.gestureId);
      if (item.reviewGestureId) ids.add(item.reviewGestureId);
      for (const optionId of item.optionGestureIds) ids.add(optionId);
    }
    return Array.from(ids)
      .map((id) => gestureMap[id])
      .filter(Boolean) as TrackpadGesture[];
  }, [gestureMap, lesson.gestureIds, questions]);

  const totalCorrect = Object.values(completedAnswers).filter(Boolean).length;
  const score = questions.length > 0 ? Math.round((totalCorrect / questions.length) * 100) : 0;
  const passed = score >= passThreshold;
  const reviewGestures = Array.from(
    new Set(
      Object.entries(completedAnswers)
        .filter(([, correct]) => !correct)
        .map(([questionId]) => questions.find((item) => item.id === questionId)?.reviewGestureId ?? questions.find((item) => item.id === questionId)?.gestureId)
        .filter(Boolean)
    )
  )
    .map((id) => gestureMap[id as string])
    .filter(Boolean) as TrackpadGesture[];

  const handleChoose = (gestureId: string) => {
    if (!question || isAnswered) return;
    setSelectedGestureId(gestureId);
    setCompletedAnswers((prev) => ({
      ...prev,
      [question.id]: gestureId === question.gestureId,
    }));
  };

  const handleNext = () => {
    if (currentIndex >= questions.length - 1) {
      setCurrentIndex(questions.length);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
    setSelectedGestureId(null);
  };

  if (currentIndex >= questions.length) {
    return (
      <div className="space-y-8">
        <div className="rounded-[28px] border border-border bg-surface p-8 md:p-10">
          <div className="mb-4 flex items-center gap-3 text-gold-dim">
            <CheckCircle2 size={24} strokeWidth={1.4} />
            <span className="text-sm font-medium">
              {mode === 'quiz' ? (passed ? '测验通过' : '测验已完成') : '本节完成'}
            </span>
          </div>

          <h2 className="font-[var(--font-display)] text-3xl font-[300] tracking-[-0.02em] text-ink">
            {mode === 'quiz' ? `得分 ${score} / 100` : '你已经完成这节手势练习'}
          </h2>
          <p className="mt-3 max-w-[580px] text-[14px] font-light leading-relaxed text-ink-secondary">
            {mode === 'quiz'
              ? passed
                ? '你已经能稳定识别这些触控板手势了。接下来可以继续学习下一课，或者回到手势库做针对性复习。'
                : '这轮测验已经完成。建议先复习下面这些容易混淆的手势，再继续下一课。'
              : '你已经看过本节涉及的动作，并完成了识别练习。现在可以继续下一课，或者先复习相关手势详情。'}
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
            {nextLessonUrl ? (
              <Link
                href={nextLessonUrl}
                className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-3 text-[14px] font-medium text-white no-underline transition-colors hover:bg-[#2D2D30]"
              >
                继续下一课 <ChevronRight size={16} strokeWidth={1.4} />
              </Link>
            ) : (
              <Link
                href="/gestures"
                className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-3 text-[14px] font-medium text-white no-underline transition-colors hover:bg-[#2D2D30]"
              >
                回到手势库 <ChevronRight size={16} strokeWidth={1.4} />
              </Link>
            )}

            <Link
              href={currentLessonUrl}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-3 text-[14px] font-medium text-ink-secondary no-underline transition-colors hover:border-gold-light hover:text-gold-dim"
            >
              <RotateCcw size={15} strokeWidth={1.4} />
              再做一次
            </Link>
          </div>
        </div>

        <div>
          <div className="mb-4 text-[13px] font-medium text-ink-secondary">本节覆盖的手势</div>
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
    <div className="space-y-7">
      {lesson.content && (
        <MarkdownContent content={lesson.content} />
      )}

      <div className="rounded-[28px] border border-border bg-surface p-5 md:p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <div className="text-[12px] font-medium tracking-[0.04em] text-gold-dim">
              {mode === 'quiz' ? '手势综合测验' : '手势识别练习'}
            </div>
            <div className="mt-1 text-[13px] font-light text-ink-tertiary">
              第 {currentIndex + 1} / {questions.length} 题
            </div>
          </div>
          {mode === 'quiz' && (
            <div className="rounded-full border border-border bg-[#FAFAF8] px-3 py-1 text-[12px] font-medium text-ink-secondary">
              当前得分 {totalCorrect}
            </div>
          )}
        </div>

        <div className="mb-5 h-2 overflow-hidden rounded-full bg-[#F3F0EB]">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#E8CFB8_0%,#D4A574_100%)] transition-all duration-300"
            style={{ width: `${((currentIndex + (isAnswered ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>

        {question.promptMode === 'animation' && correctGesture ? (
          <TrackpadGestureDemo gesture={correctGesture} />
        ) : (
          <div className="rounded-[26px] border border-border bg-[#FBFAF7] p-6 md:p-7">
            <div className="text-[12px] font-medium tracking-[0.04em] text-gold-dim">场景提示</div>
            <div className="mt-3 text-[15px] font-light leading-relaxed text-ink-secondary">
              {question.scenarioZh || question.promptZh}
            </div>
          </div>
        )}

        <div className="mt-5">
          <div className="text-[15px] font-medium text-ink">{question.promptZh}</div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {question.optionGestureIds.map((gestureId) => {
              const optionGesture = gestureMap[gestureId];
              if (!optionGesture) return null;

              const isSelected = selectedGestureId === gestureId;
              const isRightAnswer = question.gestureId === gestureId;

              return (
                <button
                  key={gestureId}
                  type="button"
                  onClick={() => handleChoose(gestureId)}
                  disabled={isAnswered}
                  className={`rounded-2xl border px-4 py-4 text-left transition-all duration-200 ${
                    isAnswered
                      ? isRightAnswer
                        ? 'border-gold-light bg-[#FFF8F0]'
                        : isSelected
                          ? 'border-[#E7DAD0] bg-[#FBF8F4]'
                          : 'border-border bg-white'
                      : 'border-border bg-white hover:border-gold-light hover:bg-[#FFFCF8]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      {Array.from({ length: optionGesture.fingerCount }).map((_, index) => (
                        <span
                          key={`${gestureId}-finger-${index}`}
                          className="inline-block h-2.5 w-2.5 rounded-full bg-gold-dim/35"
                        />
                      ))}
                    </span>
                    <span className="text-[11px] font-medium tracking-[0.04em] text-ink-tertiary uppercase">
                      {GESTURE_TYPE_LABELS[optionGesture.type] || optionGesture.type}
                      {getGestureDirectionLabel(optionGesture.direction)
                        ? ` · ${getGestureDirectionLabel(optionGesture.direction)}`
                        : ''}
                    </span>
                  </div>
                  <div className="mt-3 font-[var(--font-display)] text-[18px] font-[380] tracking-[-0.01em] text-ink">
                    {optionGesture.nameZh}
                  </div>
                  <div className="mt-1 text-[12px] font-light leading-relaxed text-ink-tertiary">
                    {optionGesture.scenarios[0] ?? optionGesture.descriptionZh}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {isAnswered && correctGesture && (
          <div className={`mt-5 rounded-2xl border p-5 ${
            isCorrect
              ? 'border-gold-light bg-[#FFF8F0]'
              : 'border-[#E9E2D7] bg-[#FBF8F4]'
          }`}>
            <div className="text-[14px] font-medium text-ink">
              {isCorrect ? '答对了' : `正确答案是「${correctGesture.nameZh}」`}
            </div>
            <div className="mt-2 text-[13px] font-light leading-relaxed text-ink-secondary">
              {question.explanationZh}
            </div>

            {!isCorrect && (
              <div className="mt-4">
                <Link
                  href={`/gestures/${question.reviewGestureId ?? question.gestureId}?from=${encodeURIComponent(currentLessonUrl)}`}
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gold-dim no-underline transition-colors hover:text-gold"
                >
                  去复习这个手势 <ChevronRight size={14} strokeWidth={1.4} />
                </Link>
              </div>
            )}

            <div className="mt-5">
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-[#2D2D30]"
              >
                {currentIndex === questions.length - 1 ? '完成本节' : '继续下一题'}
                <ChevronRight size={14} strokeWidth={1.4} />
              </button>
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="mb-3 text-[13px] font-medium text-ink-secondary">本节相关手势</div>
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
