import React from 'react';
import type { Difficulty } from '../types';
import { formatTime } from '../utils/sudoku';
import '../styles/Controls.css';

interface ControlsProps {
  onNewGame: (difficulty: Difficulty) => void;
  onToggleNotes: () => void;
  onClearCell: () => void;
  onCheckSolution: () => void;
  onSolvePuzzle: () => void;
  isNotesMode: boolean;
  elapsedTime: number;
  difficulty: Difficulty;
}

export const Controls: React.FC<ControlsProps> = ({
  onNewGame,
  onToggleNotes,
  onClearCell,
  onCheckSolution,
  onSolvePuzzle,
  isNotesMode,
  elapsedTime,
  difficulty,
}) => {


  return (
    <div className="game-controls">
      <div className="game-info">
        <div className="timer">{formatTime(elapsedTime)}</div>
        <div className="difficulty">Difficulty: {difficulty}</div>
      </div>
      
      <div className="control-buttons">
        <div className="button-group">
          <button 
            className={`control-button ${isNotesMode ? 'active' : ''}`}
            onClick={onToggleNotes}
          >
            Notes
          </button>
          <button 
            className="control-button"
            onClick={onClearCell}
          >
            Clear
          </button>
        </div>
        
        <div className="button-group">
          <button 
            className="control-button"
            onClick={onCheckSolution}
          >
            Check
          </button>
          <button 
            className="control-button"
            onClick={onSolvePuzzle}
          >
            Solve
          </button>
        </div>
        
        <div className="new-game-controls">
          <div className="new-game-label">New Game:</div>
          <div className="difficulty-buttons">
            <button 
              className={`difficulty-button ${difficulty === 'easy' ? 'active' : ''}`}
              onClick={() => onNewGame('easy')}
            >
              Easy
            </button>
            <button 
              className={`difficulty-button ${difficulty === 'medium' ? 'active' : ''}`}
              onClick={() => onNewGame('medium')}
            >
              Medium
            </button>
            <button 
              className={`difficulty-button ${difficulty === 'hard' ? 'active' : ''}`}
              onClick={() => onNewGame('hard')}
            >
              Hard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
