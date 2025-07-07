import React from 'react';
import '../styles/NumberInput.css';

interface NumberInputProps {
  onNumberClick: (num: number) => void;
  isNotesMode: boolean;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  onNumberClick,
  isNotesMode,
}) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="number-input">
      <div className="mode-indicator">
        Mode: {isNotesMode ? 'Notes' : 'Input'}
      </div>
      <div className="number-buttons">
        {numbers.map(num => (
          <button 
            key={num} 
            className="number-button"
            onClick={() => onNumberClick(num)}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};