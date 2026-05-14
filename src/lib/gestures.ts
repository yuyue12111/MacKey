import type { TrackpadGesture } from '@/types/gesture';
import gesturesData from '../../public/data/gestures.json';
import coursesData from '../../public/data/courses.json';
import type { Course, Lesson } from '@/types/course';

const courses = coursesData as Course[];

export const GESTURE_TYPE_LABELS: Record<string, string> = {
  tap: '轻点',
  swipe: '滑动',
  pinch: '捏合',
  rotate: '旋转',
  scroll: '滚动',
  'force-click': '力度点按',
};

export interface GestureCourseMeta {
  courseSlug: string;
  chapterId: string;
  chapterTitleZh: string;
  lessonId: string;
  lessonTitleZh: string;
  recommendedForBeginners: boolean;
}

export function getAllGestures(): TrackpadGesture[] {
  return gesturesData as TrackpadGesture[];
}

export function getGestureById(id: string): TrackpadGesture | undefined {
  return (gesturesData as TrackpadGesture[]).find((g) => g.id === id);
}

export function getGestureDirectionLabel(direction?: string): string | null {
  if (!direction) return null;
  if (direction === 'up') return '↑';
  if (direction === 'down') return '↓';
  if (direction === 'left') return '←';
  if (direction === 'right') return '→';
  return null;
}

export function getTrackpadCourse(): Course | undefined {
  return courses.find((course) => course.id === 'trackpad-guide');
}

export function getGestureCourseMetaMap(): Record<string, GestureCourseMeta> {
  const trackpadCourse = getTrackpadCourse();
  if (!trackpadCourse) return {};

  const map: Record<string, GestureCourseMeta> = {};

  for (const chapter of trackpadCourse.chapters) {
    for (const lesson of chapter.lessons) {
      const gestureIds = collectLessonGestureIds(lesson);

      for (const gestureId of gestureIds) {
        const existing = map[gestureId];
        const shouldReplace =
          !existing ||
          (lesson.contentType !== 'text' &&
            findLessonById(trackpadCourse, existing.lessonId)?.contentType === 'text');

        if (!shouldReplace) continue;

        map[gestureId] = {
          courseSlug: trackpadCourse.slug,
          chapterId: chapter.id,
          chapterTitleZh: chapter.titleZh,
          lessonId: lesson.id,
          lessonTitleZh: lesson.titleZh,
          recommendedForBeginners: chapter.order <= 2,
        };
      }
    }
  }

  return map;
}

function findLessonById(course: Course, lessonId: string): Lesson | undefined {
  for (const chapter of course.chapters) {
    const lesson = chapter.lessons.find((item) => item.id === lessonId);
    if (lesson) return lesson;
  }
  return undefined;
}

function collectLessonGestureIds(lesson: Lesson): string[] {
  const ids = new Set<string>(lesson.gestureIds ?? []);

  if (lesson.interactive?.type === 'gesture-try') {
    const config = lesson.interactive.config as { questions?: Array<{ gestureId?: string; optionGestureIds?: string[]; reviewGestureId?: string }> };
    for (const question of config.questions ?? []) {
      if (question.gestureId) ids.add(question.gestureId);
      if (question.reviewGestureId) ids.add(question.reviewGestureId);
      for (const optionId of question.optionGestureIds ?? []) {
        ids.add(optionId);
      }
    }
  }

  if (lesson.interactive?.type === 'gesture-scenario') {
    const config = lesson.interactive.config as {
      steps?: Array<{
        gestureIds?: string[];
        acceptedGesture?: { gestureId?: string };
        reviewGestureId?: string;
      }>;
    };
    for (const step of config.steps ?? []) {
      for (const gestureId of step.gestureIds ?? []) {
        ids.add(gestureId);
      }
      if (step.acceptedGesture?.gestureId) ids.add(step.acceptedGesture.gestureId);
      if (step.reviewGestureId) ids.add(step.reviewGestureId);
    }
  }

  if (lesson.checkpoint?.mode === 'gestures') {
    for (const gestureId of lesson.checkpoint.gestureIds ?? []) {
      ids.add(gestureId);
    }
    for (const question of lesson.checkpoint.questions ?? []) {
      ids.add(question.gestureId);
      if (question.reviewGestureId) ids.add(question.reviewGestureId);
      for (const optionId of question.optionGestureIds) {
        ids.add(optionId);
      }
    }
    for (const step of lesson.checkpoint.scenarioSteps ?? []) {
      for (const gestureId of step.gestureIds) {
        ids.add(gestureId);
      }
      ids.add(step.acceptedGesture.gestureId);
      if (step.reviewGestureId) ids.add(step.reviewGestureId);
    }
  }

  return Array.from(ids);
}
