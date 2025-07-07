import React from 'react';
import '../styles/GameMessage.css';

interface GameMessageProps {
  isComplete: boolean;
  isSolved: boolean;
  elapsedTime: number;
  onClose: () => void;
}

export const GameMessage: React.FC<GameMessageProps> = ({
  isComplete,
  isSolved,
  elapsedTime,
  onClose,
}) => {
  if (!isComplete) return null;

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="game-message-overlay">
      <div className="game-message">
        <h2>{isSolved ? 'Congratulations!' : 'Game Over'}</h2>
        <p>
          {isSolved
            ? `You solved the puzzle in ${formatTime(elapsedTime)}!`
            : 'There are mistakes in your solution.'}
        </p>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};