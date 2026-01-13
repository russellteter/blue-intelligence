'use client';

import { useEffect, useCallback, useRef } from 'react';

interface KeyboardShortcutsOptions {
  onToggleChamber?: () => void;
  onFocusSearch?: () => void;
  onClearSelection?: () => void;
  onNextDistrict?: () => void;
  onPrevDistrict?: () => void;
  onToggleHelp?: () => void;
  enabled?: boolean;
}

export function useKeyboardShortcuts({
  onToggleChamber,
  onFocusSearch,
  onClearSelection,
  onNextDistrict,
  onPrevDistrict,
  onToggleHelp,
  enabled = true,
}: KeyboardShortcutsOptions) {
  const helpVisibleRef = useRef(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      // Don't trigger shortcuts when typing in input fields
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Allow Escape to blur input and clear selection
        if (e.key === 'Escape') {
          target.blur();
          onClearSelection?.();
          e.preventDefault();
        }
        return;
      }

      // Meta/Ctrl key combinations
      if (e.metaKey || e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 'k':
            // Cmd/Ctrl + K: Focus search
            e.preventDefault();
            onFocusSearch?.();
            break;
        }
        return;
      }

      // Single key shortcuts
      switch (e.key.toLowerCase()) {
        case 'h':
          // H: Switch to House
          onToggleChamber?.();
          break;
        case 's':
          // S: Switch to Senate (or toggle if already on House)
          onToggleChamber?.();
          break;
        case '/':
          // /: Focus search (vim-style)
          e.preventDefault();
          onFocusSearch?.();
          break;
        case 'escape':
          // Escape: Clear selection
          onClearSelection?.();
          break;
        case 'j':
        case 'arrowdown':
          // J or Down: Next district
          e.preventDefault();
          onNextDistrict?.();
          break;
        case 'k':
        case 'arrowup':
          // K or Up: Previous district
          e.preventDefault();
          onPrevDistrict?.();
          break;
        case '?':
          // ?: Toggle help
          if (e.shiftKey) {
            e.preventDefault();
            helpVisibleRef.current = !helpVisibleRef.current;
            onToggleHelp?.();
          }
          break;
      }
    },
    [
      enabled,
      onToggleChamber,
      onFocusSearch,
      onClearSelection,
      onNextDistrict,
      onPrevDistrict,
      onToggleHelp,
    ]
  );

  useEffect(() => {
    if (enabled) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [enabled, handleKeyDown]);

  return {
    shortcuts: [
      { key: '/', description: 'Focus search' },
      { key: 'Cmd/Ctrl + K', description: 'Focus search' },
      { key: 'H', description: 'Switch to House' },
      { key: 'S', description: 'Switch to Senate' },
      { key: 'Escape', description: 'Clear selection' },
      { key: 'J / ↓', description: 'Next district' },
      { key: 'K / ↑', description: 'Previous district' },
      { key: '?', description: 'Show shortcuts' },
    ],
  };
}
