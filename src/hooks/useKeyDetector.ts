'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface KeyCombo {
  modifiers: string[];
  mainKey: string;
  code: string;
}

interface UseKeyDetectorOptions {
  preventDefaults?: boolean;
  onCombination?: (combo: KeyCombo) => void;
  enabled?: boolean;
}

const MODIFIER_CODES = new Set([
  'MetaLeft', 'MetaRight', 'AltLeft', 'AltRight',
  'ControlLeft', 'ControlRight', 'ShiftLeft', 'ShiftRight',
  'Fn',
]);

function normalizeCode(code: string): string {
  const map: Record<string, string> = {
    'MetaLeft': 'MetaLeft', 'MetaRight': 'MetaLeft',
    'AltLeft': 'AltLeft', 'AltRight': 'AltLeft',
    'ShiftLeft': 'ShiftLeft', 'ShiftRight': 'ShiftLeft',
    'ControlLeft': 'ControlLeft', 'ControlRight': 'ControlLeft',
  };
  return map[code] || code;
}

const CODE_TO_SYMBOL: Record<string, string> = {
  'MetaLeft': '⌘', 'AltLeft': '⌥',
  'ControlLeft': '⌃', 'ShiftLeft': '⇧', 'Fn': 'Fn',
};

export function useKeyDetector({
  preventDefaults = false,
  onCombination,
  enabled = true,
}: UseKeyDetectorOptions = {}) {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [currentCombo, setCurrentCombo] = useState<string>('');
  const [isComposing, setIsComposing] = useState(false);
  const pressedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isComposing) return;

      const code = normalizeCode(e.code);
      pressedRef.current.add(code);

      // Prevent dangerous defaults in practice mode
      if (preventDefaults && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
      }

      // Build combo when a non-modifier key is pressed
      if (!MODIFIER_CODES.has(e.code)) {
        const mods: string[] = [];
        const ref = pressedRef.current;
        if (ref.has('MetaLeft')) mods.push('⌘');
        if (ref.has('AltLeft')) mods.push('⌥');
        if (ref.has('ControlLeft')) mods.push('⌃');
        if (ref.has('ShiftLeft')) mods.push('⇧');
        if (ref.has('Fn')) mods.push('Fn');

        const combo: KeyCombo = {
          modifiers: mods,
          mainKey: e.key,
          code: e.code,
        };

        const comboStr = [
          ...mods.map((m) => {
            const entries = Object.entries(CODE_TO_SYMBOL);
            const found = entries.find(([, v]) => v === m);
            return found?.[0] ?? m;
          }),
          code,
        ].sort().join('+');
        setCurrentCombo(comboStr);
        onCombination?.(combo);
      }

      setPressedKeys(new Set(pressedRef.current));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const code = normalizeCode(e.code);
      pressedRef.current.delete(code);
      setPressedKeys(new Set(pressedRef.current));
    };

    const handleCompositionStart = () => setIsComposing(true);
    const handleCompositionEnd = () => setIsComposing(false);
    const handleBlur = () => {
      pressedRef.current.clear();
      setPressedKeys(new Set());
      setCurrentCombo('');
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('compositionstart', handleCompositionStart);
    window.addEventListener('compositionend', handleCompositionEnd);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('compositionstart', handleCompositionStart);
      window.removeEventListener('compositionend', handleCompositionEnd);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleBlur);
    };
  }, [enabled, preventDefaults, isComposing, onCombination]);

  const reset = useCallback(() => {
    pressedRef.current.clear();
    setPressedKeys(new Set());
    setCurrentCombo('');
  }, []);

  return {
    pressedKeys,
    currentCombo,
    reset,
  };
}
