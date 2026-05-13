export type FingerCount = 1 | 2 | 3 | 4;

export type GestureType = 'tap' | 'swipe' | 'pinch' | 'rotate' | 'scroll' | 'force-click';

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Point {
  x: number;
  y: number;
}

export interface PathData {
  points: Point[];
  color: string;
  width: number;
}

export interface GestureAnimationConfig {
  type: 'css' | 'canvas' | 'lottie';
  fingerStart: Point[];
  fingerEnd: Point[];
  paths?: PathData[];
  duration: number;
  loop: boolean;
}

export interface TrackpadGesture {
  id: string;
  nameZh: string;
  descriptionZh: string;
  fingerCount: FingerCount;
  type: GestureType;
  direction?: Direction;
  scenarios: string[];
  animation: GestureAnimationConfig;
  windowsEquivalent?: string;
}
