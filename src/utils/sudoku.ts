import type { Board, Difficulty } from '../types';

// Create an empty Sudoku board
export const createEmptyBoard = (): Board => {
  const board: Board = [];

  for (let row = 0; row < 9; row++) {
    board[row] = [];
    for (let col = 0; col < 9; col++) {
      board[row][col] = {
        value: null,
        isFixed: false,
        notes: []
      };
    }
  }

  return board;
};

// Check if a number can be placed at a specific position on the board
export const isValidPlacement = (
  board: Board,
  row: number,
  col: number,
  num: number
): boolean => {
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  // Combined check for row, column, and 3x3 box in a single loop where possible
  for (let i = 0; i < 9; i++) {
    // Check row
    if (board[row][i].value === num) {
      return false;
    }

    // Check column
    if (board[i][col].value === num) {
      return false;
    }
  }

  // Check 3x3 box
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      if (board[boxRow + y][boxCol + x].value === num) {
        return false;
      }
    }
  }

  return true;
};

// Solve the Sudoku puzzle using optimized backtracking
export const solveSudoku = (board: Board): boolean => {
  // Find the empty cell with the fewest possibilities for more efficient solving
  let bestRow = -1;
  let bestCol = -1;
  let minPossibilities = 10;

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col].value === null) {
        let possibilities = 0;

        // Count valid numbers quickly
        for (let num = 1; num <= 9; num++) {
          if (isValidPlacement(board, row, col, num)) {
            possibilities++;
            if (possibilities >= minPossibilities) break; // Early exit
          }
        }

        if (possibilities < minPossibilities) {
          minPossibilities = possibilities;
          bestRow = row;
          bestCol = col;
          if (possibilities === 0) {
            return false; // No valid moves, backtrack immediately
          }
          if (possibilities === 1) {
            break; // Found cell with only one possibility, use it immediately
          }
        }
      }
    }
    if (minPossibilities === 1) break; // Exit outer loop early
  }

  // If no empty cell found, puzzle is solved
  if (bestRow === -1) {
    return true;
  }

  // Try numbers for the best cell
  for (let num = 1; num <= 9; num++) {
    if (isValidPlacement(board, bestRow, bestCol, num)) {
      board[bestRow][bestCol].value = num;

      if (solveSudoku(board)) {
        return true;
      }

      board[bestRow][bestCol].value = null;
    }
  }

  return false;
};

// Generate a Sudoku puzzle with the specified difficulty
export const generatePuzzle = (difficulty: Difficulty): Board => {
  const board = createEmptyBoard();

  // Fill the diagonal 3x3 boxes first (these can be filled independently)
  fillDiagonalBoxes(board);

  // Solve the rest of the board
  solveSudoku(board);

  // Remove numbers based on difficulty
  const cellsToRemove = getCellsToRemove(difficulty);
  removeNumbers(board, cellsToRemove);

  // Mark the remaining cells as fixed
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col].value !== null) {
        board[row][col].isFixed = true;
      }
    }
  }

  return board;
};

// Fill the diagonal 3x3 boxes with random numbers
const fillDiagonalBoxes = (board: Board): void => {
  // Fill the three diagonal boxes
  for (let box = 0; box < 9; box += 3) {
    fillBox(board, box, box);
  }
};

// Fill a 3x3 box with random numbers
const fillBox = (board: Board, startRow: number, startCol: number): void => {
  const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  let index = 0;

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      board[startRow + row][startCol + col].value = nums[index++];
    }
  }
};

// Shuffle an array using Fisher-Yates algorithm
const shuffle = <T>(array: T[]): T[] => {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

// Get the number of cells to remove based on difficulty
const getCellsToRemove = (difficulty: Difficulty): number => {
  switch (difficulty) {
    case 'beginner':
      return 25; // Leave ~56 clues
    case 'easy':
      return 35; // Leave ~46 clues
    case 'medium':
      return 45; // Leave ~36 clues
    case 'hard':
      return 55; // Leave ~26 clues
    case 'expert':
      return 65; // Leave ~16 clues
    case 'master':
      return 70; // Leave ~11 clues
    default:
      return 45;
  }
};

// Remove a specific number of cells randomly
const removeNumbers = (board: Board, count: number): void => {
  let cellsRemoved = 0;

  while (cellsRemoved < count) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);

    if (board[row][col].value !== null) {
      board[row][col].value = null;
      cellsRemoved++;
    }
  }
};

// Check if the board is solved correctly
export const isBoardSolved = (board: Board): boolean => {
  // Check if all cells are filled
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col].value === null) {
        return false;
      }
    }
  }

  // Check if all rows, columns, and boxes are valid
  return allRowsValid(board) && allColumnsValid(board) && allBoxesValid(board);
};

// Helper function to check if values are unique and complete (no nulls)
const areValuesUniqueAndComplete = (values: (number | null)[]): boolean => {
  const seen = new Set<number>();

  for (const value of values) {
    if (value === null || seen.has(value)) {
      return false;
    }
    seen.add(value);
  }

  return true;
};

// Check if all rows contain unique numbers 1-9
const allRowsValid = (board: Board): boolean => {
  for (let row = 0; row < 9; row++) {
    const values = board[row].map((cell) => cell.value);
    if (!areValuesUniqueAndComplete(values)) {
      return false;
    }
  }
  return true;
};

// Check if all columns contain unique numbers 1-9
const allColumnsValid = (board: Board): boolean => {
  for (let col = 0; col < 9; col++) {
    const values = board.map((row) => row[col].value);
    if (!areValuesUniqueAndComplete(values)) {
      return false;
    }
  }
  return true;
};

// Check if all 3x3 boxes contain unique numbers 1-9
const allBoxesValid = (board: Board): boolean => {
  for (let boxRow = 0; boxRow < 9; boxRow += 3) {
    for (let boxCol = 0; boxCol < 9; boxCol += 3) {
      const values: (number | null)[] = [];

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          values.push(board[boxRow + row][boxCol + col].value);
        }
      }

      if (!areValuesUniqueAndComplete(values)) {
        return false;
      }
    }
  }
  return true;
};

// Helper function to check if values are unique (allows nulls)
const areValuesUnique = (values: (number | null)[]): boolean => {
  const seen = new Set<number>();

  for (const value of values) {
    if (value !== null) {
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
    }
  }

  return true;
};

// Check if the current board state is valid (doesn't have to be complete)
export const isBoardValid = (board: Board): boolean => {
  // Check each row
  for (let row = 0; row < 9; row++) {
    const values = board[row].map((cell) => cell.value);
    if (!areValuesUnique(values)) {
      return false;
    }
  }

  // Check each column
  for (let col = 0; col < 9; col++) {
    const values = board.map((row) => row[col].value);
    if (!areValuesUnique(values)) {
      return false;
    }
  }

  // Check each 3x3 box
  for (let boxRow = 0; boxRow < 9; boxRow += 3) {
    for (let boxCol = 0; boxCol < 9; boxCol += 3) {
      const values: (number | null)[] = [];

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          values.push(board[boxRow + row][boxCol + col].value);
        }
      }

      if (!areValuesUnique(values)) {
        return false;
      }
    }
  }

  return true;
};

// Find cells with invalid placements
export const findInvalidCells = (board: Board): [number, number][] => {
  const invalidCells = new Set<string>();

  // Check rows
  for (let row = 0; row < 9; row++) {
    const seen = new Map<number, number[]>();

    for (let col = 0; col < 9; col++) {
      const value = board[row][col].value;
      if (value !== null) {
        if (!seen.has(value)) {
          seen.set(value, []);
        }
        seen.get(value)!.push(col);
      }
    }

    // Add invalid cells to set
    seen.forEach((cols) => {
      if (cols.length > 1) {
        cols.forEach((col) => {
          invalidCells.add(`${row},${col}`);
        });
      }
    });
  }

  // Check columns
  for (let col = 0; col < 9; col++) {
    const seen = new Map<number, number[]>();

    for (let row = 0; row < 9; row++) {
      const value = board[row][col].value;
      if (value !== null) {
        if (!seen.has(value)) {
          seen.set(value, []);
        }
        seen.get(value)!.push(row);
      }
    }

    // Add invalid cells to set
    seen.forEach((rows) => {
      if (rows.length > 1) {
        rows.forEach((row) => {
          invalidCells.add(`${row},${col}`);
        });
      }
    });
  }

  // Check 3x3 boxes
  for (let boxRow = 0; boxRow < 9; boxRow += 3) {
    for (let boxCol = 0; boxCol < 9; boxCol += 3) {
      const seen = new Map<number, Array<[number, number]>>();

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          const r = boxRow + row;
          const c = boxCol + col;
          const value = board[r][c].value;

          if (value !== null) {
            if (!seen.has(value)) {
              seen.set(value, []);
            }
            seen.get(value)!.push([r, c]);
          }
        }
      }

      // Add invalid cells to set
      seen.forEach((positions) => {
        if (positions.length > 1) {
          positions.forEach(([r, c]) => {
            invalidCells.add(`${r},${c}`);
          });
        }
      });
    }
  }

  // Convert set back to array
  return Array.from(invalidCells).map((pos) => {
    const [row, col] = pos.split(',').map(Number);
    return [row, col] as [number, number];
  });
};

// Get possible values for a cell
export const getPossibleValues = (
  board: Board,
  row: number,
  col: number
): number[] => {
  if (board[row][col].value !== null) {
    return [];
  }

  const possibilities = [];

  for (let num = 1; num <= 9; num++) {
    if (isValidPlacement(board, row, col, num)) {
      possibilities.push(num);
    }
  }

  return possibilities;
};

// Format time in seconds to MM:SS
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${mins.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;
};
