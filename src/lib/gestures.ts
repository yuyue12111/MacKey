import type { TrackpadGesture } from '@/types/gesture';
import gesturesData from '../../public/data/gestures.json';

export function getAllGestures(): TrackpadGesture[] {
  return gesturesData as TrackpadGesture[];
}

export function getGestureById(id: string): TrackpadGesture | undefined {
  return (gesturesData as TrackpadGesture[]).find((g) => g.id === id);
}
