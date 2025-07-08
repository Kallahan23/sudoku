import type { Board } from '../types';

/**
 * Clears all highlighting from the board
 */
export const clearBoardHighlighting = (board: Board): Board => {
  return board.map((row) =>
    row.map((cell) => ({
      ...cell,
      isSelected: false,
      isSameNumber: false,
      isHighlightedRow: false,
      isHighlightedColumn: false
    }))
  );
};

/**
 * Efficiently applies highlighting by modifying the board in-place where possible
 */
export const applyHighlightingInPlace = (
  board: Board,
  rowIndex: number,
  colIndex: number
): void => {
  const selectedValue = board[rowIndex][colIndex].value;

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = board[row][col];

      // Clear previous highlighting
      cell.isSelected = false;
      cell.isHighlightedRow = false;
      cell.isHighlightedColumn = false;
      cell.isSameNumber = false;

      // Apply new highlighting
      if (row === rowIndex && col === colIndex) {
        cell.isSelected = true;
      } else if (row === rowIndex) {
        cell.isHighlightedRow = true;
      } else if (col === colIndex) {
        cell.isHighlightedColumn = true;
      }

      // Highlight same numbers
      if (
        selectedValue !== null &&
        cell.value === selectedValue &&
        (row !== rowIndex || col !== colIndex)
      ) {
        cell.isSameNumber = true;
      }
    }
  }
};

/**
 * Highlights cells with the same number as the given value
 */
export const highlightSameNumbers = (
  board: Board,
  value: number,
  excludePos?: [number, number]
): Board => {
  const [excludeRow, excludeCol] = excludePos || [-1, -1];

  return board.map((row, rowIndex) =>
    row.map((cell, colIndex) => {
      if (
        cell.value === value &&
        (rowIndex !== excludeRow || colIndex !== excludeCol)
      ) {
        return { ...cell, isSameNumber: true };
      }
      return cell;
    })
  );
};

/**
 * Highlights the row and column of the selected cell
 */
export const highlightRowAndColumn = (
  board: Board,
  selectedRow: number,
  selectedCol: number
): Board => {
  return board.map((row, rowIndex) =>
    row.map((cell, colIndex) => ({
      ...cell,
      isHighlightedRow: rowIndex === selectedRow && colIndex !== selectedCol,
      isHighlightedColumn: colIndex === selectedCol && rowIndex !== selectedRow
    }))
  );
};

/**
 * Selects a cell and applies all highlighting in a single pass
 */
export const selectCell = (
  board: Board,
  rowIndex: number,
  colIndex: number
): Board => {
  const selectedValue = board[rowIndex][colIndex].value;

  // Single pass through the board to apply all highlighting
  return board.map((row, rIdx) =>
    row.map((cell, cIdx) => ({
      ...cell,
      isSelected: rIdx === rowIndex && cIdx === colIndex,
      isHighlightedRow: rIdx === rowIndex && cIdx !== colIndex,
      isHighlightedColumn: cIdx === colIndex && rIdx !== rowIndex,
      isSameNumber:
        selectedValue !== null &&
        cell.value === selectedValue &&
        (rIdx !== rowIndex || cIdx !== colIndex),
      // Clear any previous highlighting states
      isInvalid: cell.isInvalid // Preserve invalid state
    }))
  );
};

/**
 * Clears all invalid cell markings
 */
export const clearInvalidCells = (board: Board): Board => {
  return board.map((row) =>
    row.map((cell) => ({
      ...cell,
      isInvalid: false
    }))
  );
};

/**
 * Checks if all cells in the board are filled (optimized with early exit)
 */
export const isBoardFilled = (board: Board): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col].value === null) {
        return false;
      }
    }
  }
  return true;
};

/**
 * Creates a copy of the board with only fixed cells preserved
 */
export const createBoardWithFixedCells = (board: Board): Board => {
  return board.map((row) =>
    row.map((cell) => ({
      ...cell,
      value: cell.isFixed ? cell.value : null,
      notes: [],
      isInvalid: false
    }))
  );
};

/**
 * Fast board copy utility for performance-critical operations
 */
export const fastBoardCopy = (board: Board): Board => {
  const newBoard: Board = new Array(9);
  for (let i = 0; i < 9; i++) {
    newBoard[i] = new Array(9);
    for (let j = 0; j < 9; j++) {
      newBoard[i][j] = { ...board[i][j] };
    }
  }
  return newBoard;
};
