// Define types for our Sudoku game

// Difficulty levels for the game
export type Difficulty = 'beginner' | 'easy' | 'medium' | 'hard' | 'expert' | 'master';

// Cell represents a single cell in the Sudoku grid
export interface Cell {
  value: number | null;
  isFixed: boolean; // Whether this cell was part of the initial puzzle
  notes: number[]; // Player's notes for possible values
  isInvalid?: boolean; // Whether this cell is part of an invalid placement
  isSelected?: boolean; // Whether this cell is currently selected
  isSameNumber?: boolean; // Whether this cell has the same number as the selected cell
  isHighlightedRow?: boolean; // Whether this cell is in the same row as the selected cell
  isHighlightedColumn?: boolean; // Whether this cell is in the same column as the selected cell
}

// The entire Sudoku board is a 9x9 grid of cells
export type Board = Cell[][];

// Game state
export interface GameState {
  board: Board;
  difficulty: Difficulty;
  startTime: number;
  elapsedTime: number;
  isComplete: boolean;
  isSolved: boolean;
  selectedCell: [number, number] | null; // Row, column of selected cell
}
