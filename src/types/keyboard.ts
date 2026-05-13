export type KeyboardLayoutType = 'ANSI' | 'ISO' | 'JIS';

export interface KeyDef {
  code: string;
  label: string;
  subLabel?: string;
  width: number;
  isModifier: boolean;
  winBadge?: string;
}

export interface KeyRow {
  id: string;
  keys: (KeyDef | null)[];
}

export interface KeyboardLayoutData {
  name: string;
  rows: KeyRow[];
}
