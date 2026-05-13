export type ModifierKey = '⌘' | '⌥' | '⌃' | '⇧' | 'Fn' | '🌐';

export type Difficulty = 'basic' | 'intermediate' | 'advanced';

export type ShortcutCategory =
  | 'system'
  | 'finder'
  | 'text'
  | 'window'
  | 'browser'
  | 'screenshot'
  | 'terminal'
  | 'accessibility';

export interface KeyCombination {
  modifiers: ModifierKey[];
  key: string;
  code: string;
}

export interface Shortcut {
  id: string;
  combination: KeyCombination;
  nameZh: string;
  descriptionZh: string;
  category: ShortcutCategory;
  difficulty: Difficulty;
  scenarios: string[];
  windowsEquivalent?: KeyCombination & { note?: string };
  isSystemWide: boolean;
  tips?: string;
  keywords: string[];
}

export interface ShortcutCategoryMeta {
  id: ShortcutCategory;
  slug: string;
  nameZh: string;
  icon: string;
  descriptionZh: string;
  order: number;
}
