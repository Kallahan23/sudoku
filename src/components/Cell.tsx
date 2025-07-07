import React from 'react';
import type { Cell as CellType } from '../types';
import '../styles/Cell.css';

interface CellProps {
  data: CellType;
  rowIndex: number;
  colIndex: number;
  onClick: (rowIndex: number, colIndex: number) => void;
}

export const Cell: React.FC<CellProps> = ({ 
  data, 
  rowIndex, 
  colIndex, 
  onClick 
}) => {
  const handleClick = () => {
    if (!data.isFixed) {
      onClick(rowIndex, colIndex);
    }
  };

  // Determine CSS classes based on cell properties
  const cellClasses = [
    'sudoku-cell',
    data.isFixed ? 'fixed' : '',
    data.isSelected ? 'selected' : '',
    data.isInvalid ? 'invalid' : '',
    // Add CSS classes for borders
    rowIndex % 3 === 0 ? 'border-top' : '',
    colIndex % 3 === 0 ? 'border-left' : '',
    rowIndex === 8 ? 'border-bottom' : '',
    colIndex === 8 ? 'border-right' : ''
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={cellClasses}
      onClick={handleClick}
    >
      {data.value ? (
        <span className="cell-value">{data.value}</span>
      ) : data.notes.length > 0 ? (
        <div className="notes-container">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <div key={num} className="note-item">
              {data.notes.includes(num) ? num : ''}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};
