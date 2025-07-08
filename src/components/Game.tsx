import React, { useState, useEffect, useCallback } from 'react';
import { Board as BoardComponent } from './Board';
import { Controls } from './Controls';
import { NumberInput } from './NumberInput';
import { GameMessage } from './GameMessage';
import type { Board, Difficulty, GameState } from '../types';
import {
  generatePuzzle,
  isBoardSolved,
  isBoardValid,
  findInvalidCells,
  solveSudoku
} from '../utils/sudoku';
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
  useEffect(() => {
    if (gameState.isComplete) return;

    const timer = setInterval(() => {
      setGameState((prev) => ({
        ...prev,
        elapsedTime: Math.floor((Date.now() - prev.startTime) / 1000)
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.isComplete]);

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
    setGameState((prev) => {
      const newBoard = [...prev.board];

      // Clear all highlighting
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          newBoard[row][col] = {
            ...newBoard[row][col],
            isSelected: false,
            isSameNumber: false,
            isHighlightedRow: false,
            isHighlightedColumn: false
          };
        }
      }

      // Select new cell
      newBoard[rowIndex][colIndex] = {
        ...newBoard[rowIndex][colIndex],
        isSelected: true
      };

      // Highlight row and column of selected cell
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (row === rowIndex && col !== colIndex) {
            newBoard[row][col] = {
              ...newBoard[row][col],
              isHighlightedRow: true
            };
          }
          if (col === colIndex && row !== rowIndex) {
            newBoard[row][col] = {
              ...newBoard[row][col],
              isHighlightedColumn: true
            };
          }
        }
      }

      // Highlight cells with same number
      const selectedValue = newBoard[rowIndex][colIndex].value;
      if (selectedValue !== null) {
        for (let row = 0; row < 9; row++) {
          for (let col = 0; col < 9; col++) {
            if (
              newBoard[row][col].value === selectedValue &&
              (row !== rowIndex || col !== colIndex)
            ) {
              newBoard[row][col] = {
                ...newBoard[row][col],
                isSameNumber: true
              };
            }
          }
        }
      }

      return {
        ...prev,
        board: newBoard,
        selectedCell: [rowIndex, colIndex]
      };
    });
  }, []);

  // Handle number input
  const handleNumberClick = useCallback(
    (num: number) => {
      setGameState((prev) => {
        if (!prev.selectedCell) return prev;

        const [rowIndex, colIndex] = prev.selectedCell;
        const newBoard = [...prev.board];

        if (newBoard[rowIndex][colIndex].isFixed) return prev;

        if (isNotesMode) {
          // Toggle note for the number
          const currentNotes = [...newBoard[rowIndex][colIndex].notes];
          const noteIndex = currentNotes.indexOf(num);

          if (noteIndex >= 0) {
            currentNotes.splice(noteIndex, 1);
          } else {
            currentNotes.push(num);
          }

          newBoard[rowIndex][colIndex] = {
            ...newBoard[rowIndex][colIndex],
            notes: currentNotes
          };
        } else {
          // Set the cell value
          newBoard[rowIndex][colIndex] = {
            ...newBoard[rowIndex][colIndex],
            value: num,
            notes: []
          };

          // Update same-number highlighting
          for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
              newBoard[row][col] = {
                ...newBoard[row][col],
                isSameNumber: false
              };
            }
          }

          // Highlight row and column of selected cell
          for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
              if (row === rowIndex && col !== colIndex) {
                newBoard[row][col] = {
                  ...newBoard[row][col],
                  isHighlightedRow: true
                };
              }
              if (col === colIndex && row !== rowIndex) {
                newBoard[row][col] = {
                  ...newBoard[row][col],
                  isHighlightedColumn: true
                };
              }
            }
          }

          // Highlight cells with same number
          for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
              if (
                newBoard[row][col].value === num &&
                (row !== rowIndex || col !== colIndex)
              ) {
                newBoard[row][col] = {
                  ...newBoard[row][col],
                  isSameNumber: true
                };
              }
            }
          }

          // Check if the board is complete
          const solved = isBoardSolved(newBoard);
          const valid = isBoardValid(newBoard);

          // Check if all cells are filled
          let allFilled = true;
          for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
              if (newBoard[r][c].value === null) {
                allFilled = false;
                break;
              }
            }
            if (!allFilled) break;
          }

          if (allFilled) {
            return {
              ...prev,
              board: newBoard,
              isComplete: true,
              isSolved: solved && valid
            };
          }
        }

        return {
          ...prev,
          board: newBoard
        };
      });
    },
    [isNotesMode]
  );

  // Toggle notes mode
  const handleToggleNotes = useCallback(() => {
    setIsNotesMode((prev) => !prev);
  }, []);

  // Clear cell
  const handleClearCell = useCallback(() => {
    setGameState((prev) => {
      if (!prev.selectedCell) return prev;

      const [rowIndex, colIndex] = prev.selectedCell;
      const newBoard = [...prev.board];

      if (newBoard[rowIndex][colIndex].isFixed) return prev;

      newBoard[rowIndex][colIndex] = {
        ...newBoard[rowIndex][colIndex],
        value: null,
        notes: []
      };

      // Clear same-number highlighting since the selected cell is now empty
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          newBoard[row][col] = {
            ...newBoard[row][col],
            isSameNumber: false
          };
        }
      }

      // Re-highlight row and column of selected cell
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (row === rowIndex && col !== colIndex) {
            newBoard[row][col] = {
              ...newBoard[row][col],
              isHighlightedRow: true
            };
          }
          if (col === colIndex && row !== rowIndex) {
            newBoard[row][col] = {
              ...newBoard[row][col],
              isHighlightedColumn: true
            };
          }
        }
      }

      return {
        ...prev,
        board: newBoard
      };
    });
  }, []);

  // Check solution
  const handleCheckSolution = useCallback(() => {
    setGameState((prev) => {
      const newBoard = [...prev.board];

      // Find invalid cells
      const invalidCells = findInvalidCells(newBoard);

      // Mark invalid cells
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          newBoard[row][col] = {
            ...newBoard[row][col],
            isInvalid: false
          };
        }
      }

      invalidCells.forEach(([row, col]) => {
        newBoard[row][col] = {
          ...newBoard[row][col],
          isInvalid: true
        };
      });

      return {
        ...prev,
        board: newBoard
      };
    });
  }, []);

  // Solve puzzle
  const handleSolvePuzzle = useCallback(() => {
    setGameState((prev) => {
      // Create a copy of the board keeping only fixed cells
      const newBoard: Board = prev.board.map((row) =>
        row.map((cell) => ({
          ...cell,
          value: cell.isFixed ? cell.value : null,
          notes: [],
          isInvalid: false
        }))
      );

      // Solve the board
      solveSudoku(newBoard);

      return {
        ...prev,
        board: newBoard,
        isComplete: true,
        isSolved: true,
        selectedCell: null
      };
    });
  }, []);

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
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;

      if (key >= '1' && key <= '9') {
        handleNumberClick(parseInt(key, 10));
      } else if (key === 'Delete' || key === 'Backspace') {
        handleClearCell();
      } else if (key === 'n' || key === 'N') {
        handleToggleNotes();
      } else if (
        key === 'ArrowUp' ||
        key === 'ArrowDown' ||
        key === 'ArrowLeft' ||
        key === 'ArrowRight'
      ) {
        setGameState((prev) => {
          if (!prev.selectedCell) return prev;

          const [rowIndex, colIndex] = prev.selectedCell;
          let newRow = rowIndex;
          let newCol = colIndex;

          if (key === 'ArrowUp') {
            newRow = Math.max(0, rowIndex - 1);
          } else if (key === 'ArrowDown') {
            newRow = Math.min(8, rowIndex + 1);
          } else if (key === 'ArrowLeft') {
            newCol = Math.max(0, colIndex - 1);
          } else if (key === 'ArrowRight') {
            newCol = Math.min(8, colIndex + 1);
          }

          if (newRow === rowIndex && newCol === colIndex) return prev;

          const newBoard = [...prev.board];

          // Clear all highlighting
          for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
              newBoard[row][col] = {
                ...newBoard[row][col],
                isSelected: false,
                isSameNumber: false,
                isHighlightedRow: false,
                isHighlightedColumn: false
              };
            }
          }

          // Select new cell
          newBoard[newRow][newCol] = {
            ...newBoard[newRow][newCol],
            isSelected: true
          };

          // Highlight row and column of selected cell
          for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
              if (row === newRow && col !== newCol) {
                newBoard[row][col] = {
                  ...newBoard[row][col],
                  isHighlightedRow: true
                };
              }
              if (col === newCol && row !== newRow) {
                newBoard[row][col] = {
                  ...newBoard[row][col],
                  isHighlightedColumn: true
                };
              }
            }
          }

          // Highlight cells with same number
          const selectedValue = newBoard[newRow][newCol].value;
          if (selectedValue !== null) {
            for (let row = 0; row < 9; row++) {
              for (let col = 0; col < 9; col++) {
                if (
                  newBoard[row][col].value === selectedValue &&
                  (row !== newRow || col !== newCol)
                ) {
                  newBoard[row][col] = {
                    ...newBoard[row][col],
                    isSameNumber: true
                  };
                }
              }
            }
          }

          return {
            ...prev,
            board: newBoard,
            selectedCell: [newRow, newCol]
          };
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClearCell, handleNumberClick, handleToggleNotes]);

  return (
    <div className='game-container'>
      <h1>Sudoku</h1>

      <div className='game-board-container'>
        <BoardComponent board={gameState.board} onCellClick={handleCellClick} />

        <div className='game-side-panel'>
          <Controls
            onNewGame={handleNewGame}
            onToggleNotes={handleToggleNotes}
            onClearCell={handleClearCell}
            onCheckSolution={handleCheckSolution}
            onSolvePuzzle={handleSolvePuzzle}
            isNotesMode={isNotesMode}
            elapsedTime={gameState.elapsedTime}
            difficulty={gameState.difficulty}
          />

          <NumberInput
            onNumberClick={handleNumberClick}
            isNotesMode={isNotesMode}
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
