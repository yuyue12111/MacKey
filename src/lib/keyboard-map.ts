import type { KeyDef, KeyTemplate, KeyboardLayoutData } from '@/types/keyboard';

const UNIT = 46;
const GAP = 5;
const FUNCTION_HEIGHT = 40;
const HALF_ARROW_HEIGHT = 21;
const ARROW_STACK_GAP = 4;

type RowItem = KeyTemplate | { gap: number };

function key(
  code: string,
  label: string,
  width: number,
  opts?: {
    subLabel?: string;
    height?: number;
    isModifier?: boolean;
    winBadge?: string;
  }
): KeyTemplate {
  return {
    code,
    label,
    subLabel: opts?.subLabel,
    width,
    height: opts?.height,
    isModifier: opts?.isModifier ?? false,
    winBadge: opts?.winBadge,
  };
}

function gap(px: number): { gap: number } {
  return { gap: px };
}

function place(item: KeyTemplate, x: number, y: number): KeyDef {
  return { ...item, x, y };
}

function placeRow(startX: number, y: number, items: RowItem[]): KeyDef[] {
  const placed: KeyDef[] = [];
  let cursor = startX;

  for (const item of items) {
    if ('gap' in item) {
      cursor += item.gap;
      continue;
    }

    placed.push(place(item, cursor, y));
    cursor += item.width * UNIT + GAP;
  }

  return placed;
}

const yFunction = 0;
const yNumber = 56;
const yQwerty = yNumber + UNIT + GAP;
const yHome = yQwerty + UNIT + GAP;
const yShift = yHome + UNIT + GAP;
const yBottom = yShift + UNIT + GAP;

const functionRow = placeRow(12, yFunction, [
  key('Escape', 'esc', 1.08, { isModifier: true, height: FUNCTION_HEIGHT }),
  gap(30),
  key('F1', 'F1', 1, { isModifier: true, height: FUNCTION_HEIGHT }),
  key('F2', 'F2', 1, { isModifier: true, height: FUNCTION_HEIGHT }),
  key('F3', 'F3', 1, { isModifier: true, height: FUNCTION_HEIGHT }),
  key('F4', 'F4', 1, { isModifier: true, height: FUNCTION_HEIGHT }),
  gap(20),
  key('F5', 'F5', 1, { isModifier: true, height: FUNCTION_HEIGHT }),
  key('F6', 'F6', 1, { isModifier: true, height: FUNCTION_HEIGHT }),
  key('F7', 'F7', 1, { isModifier: true, height: FUNCTION_HEIGHT }),
  key('F8', 'F8', 1, { isModifier: true, height: FUNCTION_HEIGHT }),
  gap(20),
  key('F9', 'F9', 1, { isModifier: true, height: FUNCTION_HEIGHT }),
  key('F10', 'F10', 1, { isModifier: true, height: FUNCTION_HEIGHT }),
  key('F11', 'F11', 1, { isModifier: true, height: FUNCTION_HEIGHT }),
  key('F12', 'F12', 1, { isModifier: true, height: FUNCTION_HEIGHT }),
  gap(26),
  key('Power', '⏻', 1.12, { isModifier: true, height: FUNCTION_HEIGHT }),
]);

const numberRow = placeRow(0, yNumber, [
  key('Backquote', '`', 1, { subLabel: '~' }),
  key('Digit1', '1', 1, { subLabel: '!' }),
  key('Digit2', '2', 1, { subLabel: '@' }),
  key('Digit3', '3', 1, { subLabel: '#' }),
  key('Digit4', '4', 1, { subLabel: '$' }),
  key('Digit5', '5', 1, { subLabel: '%' }),
  key('Digit6', '6', 1, { subLabel: '^' }),
  key('Digit7', '7', 1, { subLabel: '&' }),
  key('Digit8', '8', 1, { subLabel: '*' }),
  key('Digit9', '9', 1, { subLabel: '(' }),
  key('Digit0', '0', 1, { subLabel: ')' }),
  key('Minus', '-', 1, { subLabel: '_' }),
  key('Equal', '=', 1, { subLabel: '+' }),
  key('Backspace', 'delete', 1.58),
]);

const qwertyRow = placeRow(0, yQwerty, [
  key('Tab', 'tab', 1.42),
  key('KeyQ', 'Q', 1),
  key('KeyW', 'W', 1),
  key('KeyE', 'E', 1),
  key('KeyR', 'R', 1),
  key('KeyT', 'T', 1),
  key('KeyY', 'Y', 1),
  key('KeyU', 'U', 1),
  key('KeyI', 'I', 1),
  key('KeyO', 'O', 1),
  key('KeyP', 'P', 1),
  key('BracketLeft', '[', 1, { subLabel: '{' }),
  key('BracketRight', ']', 1, { subLabel: '}' }),
  key('Backslash', '\\', 1.42, { subLabel: '|' }),
]);

const homeRow = placeRow(0, yHome, [
  key('CapsLock', 'caps lock', 1.78),
  key('KeyA', 'A', 1),
  key('KeyS', 'S', 1),
  key('KeyD', 'D', 1),
  key('KeyF', 'F', 1),
  key('KeyG', 'G', 1),
  key('KeyH', 'H', 1),
  key('KeyJ', 'J', 1),
  key('KeyK', 'K', 1),
  key('KeyL', 'L', 1),
  key('Semicolon', ';', 1, { subLabel: ':' }),
  key('Quote', "'", 1, { subLabel: '"' }),
  key('Enter', 'return', 1.8),
]);

const bottomAlphaRow = placeRow(0, yShift, [
  key('ShiftLeft', '⇧', 2.28, { isModifier: true }),
  key('KeyZ', 'Z', 1),
  key('KeyX', 'X', 1),
  key('KeyC', 'C', 1),
  key('KeyV', 'V', 1),
  key('KeyB', 'B', 1),
  key('KeyN', 'N', 1),
  key('KeyM', 'M', 1),
  key('Comma', ',', 1, { subLabel: '<' }),
  key('Period', '.', 1, { subLabel: '>' }),
  key('Slash', '/', 1, { subLabel: '?' }),
  key('ShiftRight', '⇧', 2.28, { isModifier: true }),
]);

const modifierRowLeft = placeRow(0, yBottom, [
  key('Fn', 'fn', 1.08, { isModifier: true }),
  key('ControlLeft', '⌃', 1.08, { isModifier: true, subLabel: 'control', winBadge: 'Ctrl' }),
  key('AltLeft', '⌥', 1.08, { isModifier: true, subLabel: 'option', winBadge: 'Alt' }),
  key('MetaLeft', '⌘', 1.58, { isModifier: true, subLabel: 'command', winBadge: 'Win' }),
  key('Space', 'space', 5.85),
  key('MetaRight', '⌘', 1.58, { isModifier: true, subLabel: 'command', winBadge: 'Win' }),
  key('AltRight', '⌥', 1.08, { isModifier: true, subLabel: 'option', winBadge: 'Alt' }),
]);

const lastModifierKey = modifierRowLeft[modifierRowLeft.length - 1];
const arrowLeftX = lastModifierKey.x + lastModifierKey.width * UNIT + GAP;
const arrowCenterX = arrowLeftX + 1.02 * UNIT + GAP;
const arrowRightX = arrowCenterX + 1.02 * UNIT + GAP;

const arrowKeys: KeyDef[] = [
  place(key('ArrowLeft', '←', 1.02, { isModifier: true }), arrowLeftX, yBottom),
  place(key('ArrowRight', '→', 1.02, { isModifier: true }), arrowRightX, yBottom),
  place(key('ArrowUp', '↑', 1.02, { isModifier: true, height: HALF_ARROW_HEIGHT }), arrowCenterX, yBottom),
  place(
    key('ArrowDown', '↓', 1.02, { isModifier: true, height: HALF_ARROW_HEIGHT }),
    arrowCenterX,
    yBottom + HALF_ARROW_HEIGHT + ARROW_STACK_GAP
  ),
];

const keys = [
  ...functionRow,
  ...numberRow,
  ...qwertyRow,
  ...homeRow,
  ...bottomAlphaRow,
  ...modifierRowLeft,
  ...arrowKeys,
];

const width = Math.max(...keys.map((item) => item.x + item.width * UNIT));
const height = Math.max(...keys.map((item) => item.y + (item.height ?? UNIT)));

export const ANSI_LAYOUT: KeyboardLayoutData = {
  name: 'ANSI (MacBook Pro 14-inch)',
  width,
  height,
  keys,
};

export const CODE_TO_KEY_LABEL: Record<string, string> = {
  'MetaLeft': '⌘',
  'MetaRight': '⌘',
  'AltLeft': '⌥',
  'AltRight': '⌥',
  'ControlLeft': '⌃',
  'ControlRight': '⌃',
  'ShiftLeft': '⇧',
  'ShiftRight': '⇧',
  'Fn': 'Fn',
  'Space': 'Space',
  'Tab': 'Tab',
  'Escape': 'Esc',
  'Enter': 'Return',
  'Backspace': '⌫',
  'ArrowLeft': '←',
  'ArrowRight': '→',
  'ArrowUp': '↑',
  'ArrowDown': '↓',
};
