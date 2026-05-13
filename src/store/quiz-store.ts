import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { QuizSession, QuizPhase, QuizMode } from '@/types/quiz';

interface QuizState {
  currentSession: QuizSession | null;
  phase: QuizPhase;
  setSession: (session: QuizSession) => void;
  setPhase: (phase: QuizPhase) => void;
  recordAnswer: (questionId: string, correct: boolean) => void;
  nextQuestion: () => void;
  completeSession: () => void;
  clearSession: () => void;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      currentSession: null,
      phase: 'idle',

      setSession: (session) =>
        set({ currentSession: { ...session, startTime: Date.now() }, phase: 'countdown' }),

      setPhase: (phase) => set({ phase }),

      recordAnswer: (questionId, correct) => {
        const s = get().currentSession;
        if (!s) return;
        set({
          currentSession: {
            ...s,
            answers: { ...s.answers, [questionId]: correct },
            score: correct ? s.score + 1 : s.score,
          },
        });
      },

      nextQuestion: () => {
        const s = get().currentSession;
        if (!s) return;
        const next = s.currentIndex + 1;
        if (next >= s.questions.length) {
          set({
            phase: 'result',
            currentSession: { ...s, endTime: Date.now() },
          });
        } else {
          set({ currentSession: { ...s, currentIndex: next }, phase: 'asking' });
        }
      },

      completeSession: () => {
        const s = get().currentSession;
        if (!s) return;
        set({
          phase: 'result',
          currentSession: { ...s, endTime: Date.now() },
        });
      },

      clearSession: () => set({ currentSession: null, phase: 'idle' }),
    }),
    { name: 'macedu_quiz_current' }
  )
);
