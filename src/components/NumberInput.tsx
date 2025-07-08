import React from 'react';
import '../styles/NumberInput.css';

interface NumberInputProps {
  onNumberClick: (num: number) => void;
  isNotesMode: boolean;
  disabledNumbers: Set<number>;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  onNumberClick,
  isNotesMode,
  disabledNumbers,
}) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="number-input">
      <div className="mode-indicator">
        Mode: {isNotesMode ? 'Notes' : 'Input'}
      </div>
      <div className="number-buttons">
        {numbers.map(num => {
          const isDisabled = disabledNumbers.has(num);
          return (
            <button 
              key={num} 
              className={`number-button ${isDisabled ? 'disabled' : ''}`}
              onClick={() => onNumberClick(num)}
              disabled={isDisabled}
            >
              {num}
            </button>
          );
        })}
      </div>
    </div>
  );
};