import { useEffect } from 'react';

interface KeyboardControlsProps {
  onNumberInput: (num: number) => void;
  onClearCell: () => void;
  onToggleNotes: () => void;
  onNavigate: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

export const useKeyboardControls = ({
  onNumberInput,
  onClearCell,
  onToggleNotes,
  onNavigate
}: KeyboardControlsProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;

      if (key >= '1' && key <= '9') {
        onNumberInput(parseInt(key, 10));
      } else if (key === 'Delete' || key === 'Backspace') {
        onClearCell();
      } else if (key === 'n' || key === 'N') {
        onToggleNotes();
      } else if (key === 'ArrowUp') {
        onNavigate('up');
      } else if (key === 'ArrowDown') {
        onNavigate('down');
      } else if (key === 'ArrowLeft') {
        onNavigate('left');
      } else if (key === 'ArrowRight') {
        onNavigate('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNumberInput, onClearCell, onToggleNotes, onNavigate]);
};
