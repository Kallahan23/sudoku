import React, { useState, useCallback } from 'react';
import { Board as BoardComponent } from './Board';
import { Controls } from './Controls';
import { NumberInput } from './NumberInput';
import { GameMessage } from './GameMessage';
import type { Difficulty, GameState } from '../types';
import { generatePuzzle } from '../utils/sudoku';
import { selectCell } from '../utils/boardUtils';
import {
  handleNumberInput,
  handleCellClear,
  handlePuzzleSolve,
  handleKeyboardNavigation,
  getDisabledNumbers
} from '../utils/gameUtils';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { useGameTimer } from '../hooks/useGameTimer';
import '../styles/Game.css';

export const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: generatePuzzle('medium'),
    difficulty: 'medium',
    startTime: Date.now(),
    elapsedTime: 0,
    isComplete: false,
    isSolved: false,
    selectedCell: null
  });

  const [isNotesMode, setIsNotesMode] = useState(false);

  // Update timer
  useGameTimer({
    startTime: gameState.startTime,
    isComplete: gameState.isComplete,
    onTimerUpdate: (elapsedTime) => {
      setGameState((prev) => ({ ...prev, elapsedTime }));
    }
  });

  // Start new game
  const handleNewGame = useCallback((difficulty: Difficulty) => {
    setGameState({
      board: generatePuzzle(difficulty),
      difficulty,
      startTime: Date.now(),
      elapsedTime: 0,
      isComplete: false,
      isSolved: false,
      selectedCell: null
    });
    setIsNotesMode(false);
  }, []);

  // Handle cell click
  const handleCellClick = useCallback((rowIndex: number, colIndex: number) => {
    setGameState((prev) => ({
      ...prev,
      board: selectCell(prev.board, rowIndex, colIndex),
      selectedCell: [rowIndex, colIndex]
    }));
  }, []);

  // Handle number input
  const handleNumberClick = useCallback(
    (num: number) => {
      setGameState((prev) => handleNumberInput(prev, num, isNotesMode));
    },
    [isNotesMode]
  );

  // Toggle notes mode
  const handleToggleNotes = useCallback(() => {
    setIsNotesMode((prev) => !prev);
  }, []);

  // Clear cell
  const handleClear = useCallback(() => {
    setGameState((prev) => handleCellClear(prev));
  }, []);

  // Solve puzzle
  const handleSolve = useCallback(() => {
    setGameState((prev) => handlePuzzleSolve(prev));
  }, []);

  // Handle navigation
  const handleNavigation = useCallback(
    (direction: 'up' | 'down' | 'left' | 'right') => {
      setGameState((prev) => handleKeyboardNavigation(prev, direction));
    },
    []
  );

  // Close game message
  const handleCloseMessage = useCallback(() => {
    if (gameState.isSolved) {
      handleNewGame(gameState.difficulty);
    } else {
      setGameState((prev) => ({
        ...prev,
        isComplete: false
      }));
    }
  }, [gameState.difficulty, gameState.isSolved, handleNewGame]);

  // Handle keyboard input
  useKeyboardControls({
    onNumberInput: handleNumberClick,
    onClearCell: handleClear,
    onToggleNotes: handleToggleNotes,
    onNavigate: handleNavigation
  });

  return (
    <div className='game-container'>
      <h1>Sudoku</h1>

      <div className='game-board-container'>
        <BoardComponent board={gameState.board} onCellClick={handleCellClick} />

        <div className='game-side-panel'>
          <NumberInput
            onNumberClick={handleNumberClick}
            isNotesMode={isNotesMode}
            disabledNumbers={getDisabledNumbers(gameState.board)}
          />
          <Controls
            onNewGame={handleNewGame}
            onToggleNotes={handleToggleNotes}
            onClearCell={handleClear}
            onSolvePuzzle={handleSolve}
            isNotesMode={isNotesMode}
            elapsedTime={gameState.elapsedTime}
            difficulty={gameState.difficulty}
          />
        </div>
      </div>

      <GameMessage
        isComplete={gameState.isComplete}
        isSolved={gameState.isSolved}
        elapsedTime={gameState.elapsedTime}
        onClose={handleCloseMessage}
      />
    </div>
  );
};
