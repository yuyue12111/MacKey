import type { KeyboardLayoutData, KeyDef } from '@/types/keyboard';

function key(
  code: string,
  label: string,
  width: number,
  opts?: { subLabel?: string; isModifier?: boolean; winBadge?: string }
): KeyDef {
  return {
    code,
    label,
    subLabel: opts?.subLabel,
    width,
    isModifier: opts?.isModifier ?? false,
    winBadge: opts?.winBadge,
  };
}

export const ANSI_LAYOUT: KeyboardLayoutData = {
  name: 'ANSI (标准美式)',
  rows: [
    {
      id: 'function',
      keys: [
        key('Escape', 'esc', 1), null,
        key('F1', 'F1', 1, { isModifier: true }), key('F2', 'F2', 1, { isModifier: true }),
        key('F3', 'F3', 1, { isModifier: true }), key('F4', 'F4', 1, { isModifier: true }), null,
        key('F5', 'F5', 1, { isModifier: true }), key('F6', 'F6', 1, { isModifier: true }),
        key('F7', 'F7', 1, { isModifier: true }), key('F8', 'F8', 1, { isModifier: true }), null,
        key('F9', 'F9', 1, { isModifier: true }), key('F10', 'F10', 1, { isModifier: true }),
        key('F11', 'F11', 1, { isModifier: true }), key('F12', 'F12', 1, { isModifier: true }), null,
        key('Power', '⏻', 1, { isModifier: true }),
      ],
    },
    {
      id: 'number',
      keys: [
        key('Backquote', '`', 1, { subLabel: '~' }),
        key('Digit1', '1', 1, { subLabel: '!' }), key('Digit2', '2', 1, { subLabel: '@' }),
        key('Digit3', '3', 1, { subLabel: '#' }), key('Digit4', '4', 1, { subLabel: '$' }),
        key('Digit5', '5', 1, { subLabel: '%' }), key('Digit6', '6', 1, { subLabel: '^' }),
        key('Digit7', '7', 1, { subLabel: '&' }), key('Digit8', '8', 1, { subLabel: '*' }),
        key('Digit9', '9', 1, { subLabel: '(' }), key('Digit0', '0', 1, { subLabel: ')' }),
        key('Minus', '-', 1, { subLabel: '_' }), key('Equal', '=', 1, { subLabel: '+' }),
        key('Backspace', 'delete', 1.5),
      ],
    },
    {
      id: 'qwerty',
      keys: [
        key('Tab', 'tab', 1.5),
        key('KeyQ', 'Q', 1), key('KeyW', 'W', 1), key('KeyE', 'E', 1),
        key('KeyR', 'R', 1), key('KeyT', 'T', 1), key('KeyY', 'Y', 1),
        key('KeyU', 'U', 1), key('KeyI', 'I', 1), key('KeyO', 'O', 1),
        key('KeyP', 'P', 1),
        key('BracketLeft', '[', 1, { subLabel: '{' }),
        key('BracketRight', ']', 1, { subLabel: '}' }),
        key('Backslash', '\\', 1, { subLabel: '|' }),
      ],
    },
    {
      id: 'home',
      keys: [
        key('CapsLock', 'caps lock', 1.75),
        key('KeyA', 'A', 1), key('KeyS', 'S', 1), key('KeyD', 'D', 1),
        key('KeyF', 'F', 1), key('KeyG', 'G', 1), key('KeyH', 'H', 1),
        key('KeyJ', 'J', 1), key('KeyK', 'K', 1), key('KeyL', 'L', 1),
        key('Semicolon', ';', 1, { subLabel: ':' }),
        key('Quote', "'", 1, { subLabel: '"' }),
        key('Enter', 'return', 2),
      ],
    },
    {
      id: 'bottom-alpha',
      keys: [
        key('ShiftLeft', '⇧', 2.25, { isModifier: true }),
        key('KeyZ', 'Z', 1), key('KeyX', 'X', 1), key('KeyC', 'C', 1),
        key('KeyV', 'V', 1), key('KeyB', 'B', 1), key('KeyN', 'N', 1),
        key('KeyM', 'M', 1),
        key('Comma', ',', 1, { subLabel: '<' }), key('Period', '.', 1, { subLabel: '>' }),
        key('Slash', '/', 1, { subLabel: '?' }),
        key('ShiftRight', '⇧', 2.75, { isModifier: true }),
      ],
    },
    {
      id: 'modifiers',
      keys: [
        key('Fn', 'fn', 1.5, { isModifier: true }),
        key('ControlLeft', '⌃', 1.5, { isModifier: true, subLabel: 'control', winBadge: 'Ctrl' }),
        key('AltLeft', '⌥', 1.5, { isModifier: true, subLabel: 'option', winBadge: 'Alt' }),
        key('MetaLeft', '⌘', 2, { isModifier: true, subLabel: 'command', winBadge: 'Win' }),
        key('Space', 'space', 6.25),
        key('MetaRight', '⌘', 2, { isModifier: true, subLabel: 'command', winBadge: 'Win' }),
        key('AltRight', '⌥', 1.5, { isModifier: true, subLabel: 'option', winBadge: 'Alt' }),
        key('ArrowLeft', '←', 1, { isModifier: true }),
        key('ArrowUp', '↑', 1, { isModifier: true }),
        key('ArrowDown', '↓', 1, { isModifier: true }),
        key('ArrowRight', '→', 1, { isModifier: true }),
      ],
    },
  ],
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
