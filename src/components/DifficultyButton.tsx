import React from 'react';
import type { Difficulty } from '../types';

interface DifficultyButtonProps {
  difficulty: Difficulty;
  currentDifficulty: Difficulty;
  onNewGame: (difficulty: Difficulty) => void;
  label: string;
}

export const DifficultyButton: React.FC<DifficultyButtonProps> = ({
  difficulty,
  currentDifficulty,
  onNewGame,
  label
}) => (
  <button
    className={`difficulty-button ${currentDifficulty === difficulty ? 'active' : ''}`}
    onClick={() => onNewGame(difficulty)}
  >
    {label}
  </button>
);
