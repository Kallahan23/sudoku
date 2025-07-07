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
        notes: [],
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
  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row][x].value === num) {
      return false;
    }
  }
  
  // Check column
  for (let y = 0; y < 9; y++) {
    if (board[y][col].value === num) {
      return false;
    }
  }
  
  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      if (board[boxRow + y][boxCol + x].value === num) {
        return false;
      }
    }
  }
  
  return true;
};

// Solve the Sudoku puzzle using backtracking
export const solveSudoku = (board: Board): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      // Find an empty cell
      if (board[row][col].value === null) {
        // Try different numbers
        for (let num = 1; num <= 9; num++) {
          if (isValidPlacement(board, row, col, num)) {
            // Place the number
            board[row][col].value = num;
            
            // Recursively solve the rest
            if (solveSudoku(board)) {
              return true;
            }
            
            // If not successful, backtrack
            board[row][col].value = null;
          }
        }
        // No valid number found
        return false;
      }
    }
  }
  // All cells are filled
  return true;
};

// Generate a Sudoku puzzle with the specified difficulty
export const generatePuzzle = (difficulty: Difficulty): Board => {
  const board = createEmptyBoard();
  
  // Fill the diagonal 3x3 boxes first (these can be filled independently)
  fillDiagonalBoxes(board);
  
  // Solve the rest of the board
  solveSudoku(board);
  
  // Make a deep copy of the solved board
  const solvedBoard = JSON.parse(JSON.stringify(board));
  
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
    case 'easy':
      return 40; // Leave ~41 clues
    case 'medium':
      return 50; // Leave ~31 clues
    case 'hard':
      return 60; // Leave ~21 clues
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
  return (
    allRowsValid(board) && 
    allColumnsValid(board) && 
    allBoxesValid(board)
  );
};

// Check if all rows contain unique numbers 1-9
const allRowsValid = (board: Board): boolean => {
  for (let row = 0; row < 9; row++) {
    const seen = new Set<number>();
    
    for (let col = 0; col < 9; col++) {
      const value = board[row][col].value;
      if (value === null || seen.has(value)) {
        return false;
      }
      seen.add(value);
    }
  }
  
  return true;
};

// Check if all columns contain unique numbers 1-9
const allColumnsValid = (board: Board): boolean => {
  for (let col = 0; col < 9; col++) {
    const seen = new Set<number>();
    
    for (let row = 0; row < 9; row++) {
      const value = board[row][col].value;
      if (value === null || seen.has(value)) {
        return false;
      }
      seen.add(value);
    }
  }
  
  return true;
};

// Check if all 3x3 boxes contain unique numbers 1-9
const allBoxesValid = (board: Board): boolean => {
  for (let boxRow = 0; boxRow < 9; boxRow += 3) {
    for (let boxCol = 0; boxCol < 9; boxCol += 3) {
      const seen = new Set<number>();
      
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          const value = board[boxRow + row][boxCol + col].value;
          if (value === null || seen.has(value)) {
            return false;
          }
          seen.add(value);
        }
      }
    }
  }
  
  return true;
};

// Check if the current board state is valid (doesn't have to be complete)
export const isBoardValid = (board: Board): boolean => {
  // Check each row
  for (let row = 0; row < 9; row++) {
    const seen = new Set<number>();
    
    for (let col = 0; col < 9; col++) {
      const value = board[row][col].value;
      if (value !== null) {
        if (seen.has(value)) {
          return false;
        }
        seen.add(value);
      }
    }
  }
  
  // Check each column
  for (let col = 0; col < 9; col++) {
    const seen = new Set<number>();
    
    for (let row = 0; row < 9; row++) {
      const value = board[row][col].value;
      if (value !== null) {
        if (seen.has(value)) {
          return false;
        }
        seen.add(value);
      }
    }
  }
  
  // Check each 3x3 box
  for (let boxRow = 0; boxRow < 9; boxRow += 3) {
    for (let boxCol = 0; boxCol < 9; boxCol += 3) {
      const seen = new Set<number>();
      
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          const value = board[boxRow + row][boxCol + col].value;
          if (value !== null) {
            if (seen.has(value)) {
              return false;
            }
            seen.add(value);
          }
        }
      }
    }
  }
  
  return true;
};

// Find cells with invalid placements
export const findInvalidCells = (board: Board): [number, number][] => {
  const invalidCells: [number, number][] = [];
  
  // Check rows
  for (let row = 0; row < 9; row++) {
    const seen: Record<number, number[]> = {};
    
    for (let col = 0; col < 9; col++) {
      const value = board[row][col].value;
      if (value !== null) {
        if (!seen[value]) {
          seen[value] = [];
        }
        seen[value].push(col);
      }
    }
    
    for (const value in seen) {
      if (seen[value].length > 1) {
        seen[value].forEach(col => {
          invalidCells.push([row, col]);
        });
      }
    }
  }
  
  // Check columns
  for (let col = 0; col < 9; col++) {
    const seen: Record<number, number[]> = {};
    
    for (let row = 0; row < 9; row++) {
      const value = board[row][col].value;
      if (value !== null) {
        if (!seen[value]) {
          seen[value] = [];
        }
        seen[value].push(row);
      }
    }
    
    for (const value in seen) {
      if (seen[value].length > 1) {
        seen[value].forEach(row => {
          invalidCells.push([row, col]);
        });
      }
    }
  }
  
  // Check 3x3 boxes
  for (let boxRow = 0; boxRow < 9; boxRow += 3) {
    for (let boxCol = 0; boxCol < 9; boxCol += 3) {
      const seen: Record<number, Array<[number, number]>> = {};
      
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          const r = boxRow + row;
          const c = boxCol + col;
          const value = board[r][c].value;
          
          if (value !== null) {
            if (!seen[value]) {
              seen[value] = [];
            }
            seen[value].push([r, c]);
          }
        }
      }
      
      for (const value in seen) {
        if (seen[value].length > 1) {
          seen[value].forEach(([r, c]) => {
            invalidCells.push([r, c]);
          });
        }
      }
    }
  }
  
  // Remove duplicates
  return Array.from(new Set(invalidCells.map(cell => JSON.stringify(cell))))
    .map(cell => JSON.parse(cell));
};

// Get possible values for a cell
export const getPossibleValues = (board: Board, row: number, col: number): number[] => {
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
  
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
