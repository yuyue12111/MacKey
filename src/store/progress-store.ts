import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProgressState {
  completedLessons: string[];
  completedQuizzes: string[];
  favoriteShortcuts: string[];
  dailyPractice: Record<string, number>;
  quizScores: Record<string, number>;
  completeLesson: (lessonId: string) => void;
  toggleFavorite: (shortcutId: string) => void;
  recordPractice: () => void;
  recordQuizScore: (quizId: string, score: number) => void;
  getCourseProgress: (courseId: string, totalLessons: number) => number;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedLessons: [],
      completedQuizzes: [],
      favoriteShortcuts: [],
      dailyPractice: {},
      quizScores: {},

      completeLesson: (lessonId) =>
        set((s) => ({
          completedLessons: s.completedLessons.includes(lessonId)
            ? s.completedLessons
            : [...s.completedLessons, lessonId],
        })),

      toggleFavorite: (shortcutId) =>
        set((s) => ({
          favoriteShortcuts: s.favoriteShortcuts.includes(shortcutId)
            ? s.favoriteShortcuts.filter((id) => id !== shortcutId)
            : [...s.favoriteShortcuts, shortcutId],
        })),

      recordPractice: () =>
        set((s) => {
          const today = new Date().toISOString().slice(0, 10);
          return {
            dailyPractice: {
              ...s.dailyPractice,
              [today]: (s.dailyPractice[today] ?? 0) + 1,
            },
          };
        }),

      recordQuizScore: (quizId, score) =>
        set((s) => ({
          quizScores: {
            ...s.quizScores,
            [quizId]: Math.max(s.quizScores[quizId] ?? 0, score),
          },
        })),

      getCourseProgress: (courseId, totalLessons) => {
        const state = get();
        const prefix = `${courseId}-`;
        const completed = state.completedLessons.filter((id) =>
          id.startsWith(prefix)
        ).length;
        return totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
      },
    }),
    { name: 'macedu_progress' }
  )
);
