export type KeyboardLayoutType = 'ANSI' | 'ISO' | 'JIS';

export interface KeyTemplate {
  code: string;
  label: string;
  subLabel?: string;
  width: number;
  height?: number;
  isModifier: boolean;
  winBadge?: string;
}

export interface KeyDef extends KeyTemplate {
  x: number;
  y: number;
}

export interface KeyboardLayoutData {
  name: string;
  width: number;
  height: number;
  keys: KeyDef[];
}
