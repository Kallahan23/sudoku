import type { GameState } from '../types';
import {
  selectCell,
  isBoardFilled,
  createBoardWithFixedCells
} from './boardUtils';
import {
  isBoardSolved,
  isBoardValid,
  findInvalidCells,
  solveSudoku
} from './sudoku';

/**
 * Handles number input for a cell
 */
export const handleNumberInput = (
  gameState: GameState,
  num: number,
  isNotesMode: boolean
): GameState => {
  if (!gameState.selectedCell) return gameState;

  const [rowIndex, colIndex] = gameState.selectedCell;
  const newBoard = [...gameState.board];

  if (newBoard[rowIndex][colIndex].isFixed) return gameState;

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

    return {
      ...gameState,
      board: newBoard
    };
  }

  // Set the cell value
  newBoard[rowIndex][colIndex] = {
    ...newBoard[rowIndex][colIndex],
    value: num,
    notes: []
  };

  // Apply highlighting for the new value
  const highlightedBoard = selectCell(newBoard, rowIndex, colIndex);

  // Create intermediate state for validation
  const intermediateState = {
    ...gameState,
    board: highlightedBoard
  };

  // Apply validation immediately after number input
  const validatedState = handleSolutionCheck(intermediateState);

  // Check if the board is complete
  if (isBoardFilled(validatedState.board)) {
    const solved = isBoardSolved(validatedState.board);
    const valid = isBoardValid(validatedState.board);

    return {
      ...validatedState,
      isComplete: true,
      isSolved: solved && valid
    };
  }

  return validatedState;
};

/**
 * Handles clearing a cell (optimized single-pass)
 */
export const handleCellClear = (gameState: GameState): GameState => {
  if (!gameState.selectedCell) return gameState;

  const [rowIndex, colIndex] = gameState.selectedCell;

  if (gameState.board[rowIndex][colIndex].isFixed) return gameState;

  // Single pass: clear cell and apply highlighting
  const newBoard = gameState.board.map((row, rIdx) =>
    row.map((cell, cIdx) => {
      if (rIdx === rowIndex && cIdx === colIndex) {
        // Clear the selected cell
        return {
          ...cell,
          value: null,
          notes: [],
          isSelected: true,
          isHighlightedRow: false,
          isHighlightedColumn: false,
          isSameNumber: false
        };
      }

      // Apply highlighting for other cells
      return {
        ...cell,
        isSelected: false,
        isHighlightedRow: rIdx === rowIndex,
        isHighlightedColumn: cIdx === colIndex,
        isSameNumber: false // No same numbers since cleared cell is empty
      };
    })
  );

  return {
    ...gameState,
    board: newBoard
  };
};

/**
 * Handles solution checking (optimized single-pass)
 */
export const handleSolutionCheck = (gameState: GameState): GameState => {
  const invalidCells = findInvalidCells(gameState.board);
  const invalidCellsSet = new Set(invalidCells.map(([r, c]) => `${r},${c}`));

  // Single pass: clear all invalid markings and set new ones
  const newBoard = gameState.board.map((row, rowIndex) =>
    row.map((cell, colIndex) => ({
      ...cell,
      isInvalid: invalidCellsSet.has(`${rowIndex},${colIndex}`)
    }))
  );

  return {
    ...gameState,
    board: newBoard
  };
};

/**
 * Handles puzzle solving
 */
export const handlePuzzleSolve = (gameState: GameState): GameState => {
  const newBoard = createBoardWithFixedCells(gameState.board);
  solveSudoku(newBoard);

  return {
    ...gameState,
    board: newBoard,
    isComplete: true,
    isSolved: true,
    selectedCell: null
  };
};

/**
 * Handles keyboard navigation
 */
export const handleKeyboardNavigation = (
  gameState: GameState,
  direction: 'up' | 'down' | 'left' | 'right'
): GameState => {
  if (!gameState.selectedCell) return gameState;

  const [rowIndex, colIndex] = gameState.selectedCell;
  let newRow = rowIndex;
  let newCol = colIndex;

  switch (direction) {
    case 'up':
      newRow = Math.max(0, rowIndex - 1);
      break;
    case 'down':
      newRow = Math.min(8, rowIndex + 1);
      break;
    case 'left':
      newCol = Math.max(0, colIndex - 1);
      break;
    case 'right':
      newCol = Math.min(8, colIndex + 1);
      break;
  }

  if (newRow === rowIndex && newCol === colIndex) return gameState;

  const newBoard = selectCell(gameState.board, newRow, newCol);

  return {
    ...gameState,
    board: newBoard,
    selectedCell: [newRow, newCol]
  };
};
