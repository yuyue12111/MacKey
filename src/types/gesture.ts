export type FingerCount = 1 | 2 | 3 | 4;

export type GestureType = 'tap' | 'swipe' | 'pinch' | 'rotate' | 'scroll' | 'force-click';

export type Direction = 'up' | 'down' | 'left' | 'right';
export type GestureSimulationMode = 'tap' | 'drag' | 'pinch' | 'rotate' | 'press';
export type GestureEdgeZone = 'left' | 'right' | 'top' | 'bottom' | 'none';
export type GesturePinchKind = 'in' | 'out';
export type GestureRotationDirection = 'clockwise' | 'counterclockwise';

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

export interface GestureSimulationInput {
  fingerCount: FingerCount;
  mode: GestureSimulationMode;
  start: Point;
  end: Point;
  distance: number;
  direction?: Direction;
  edge?: GestureEdgeZone;
  tapCount?: 1 | 2;
  pinchKind?: GesturePinchKind;
  rotationDirection?: GestureRotationDirection;
}

export interface GestureMismatchReason {
  kind:
    | 'fingerCount'
    | 'mode'
    | 'direction'
    | 'edge'
    | 'tapCount'
    | 'pinchKind'
    | 'rotationDirection'
    | 'distance';
  messageZh: string;
}

export interface GestureMatchResult {
  matched: boolean;
  reason?: GestureMismatchReason;
}
