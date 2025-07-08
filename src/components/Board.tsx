import React from 'react';
import { Cell } from './Cell';
import type { Board as BoardType } from '../types';
import '../styles/Board.css';

interface BoardProps {
  board: BoardType;
  onCellClick: (rowIndex: number, colIndex: number) => void;
}

export const Board: React.FC<BoardProps> = ({ board, onCellClick }) => {
  return (
    <div className='sudoku-board'>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className='board-row'>
          {row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              data={cell}
              rowIndex={rowIndex}
              colIndex={colIndex}
              onClick={onCellClick}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
