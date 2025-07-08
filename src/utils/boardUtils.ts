import type { Board } from '../types';

/**
 * Clears all highlighting from the board
 */
export const clearBoardHighlighting = (board: Board): Board => {
  return board.map(row => 
    row.map(cell => ({
      ...cell,
      isSelected: false,
      isSameNumber: false,
      isHighlightedRow: false,
      isHighlightedColumn: false
    }))
  );
};

/**
 * Highlights cells with the same number as the given value
 */
export const highlightSameNumbers = (board: Board, value: number, excludePos?: [number, number]): Board => {
  const [excludeRow, excludeCol] = excludePos || [-1, -1];
  
  return board.map((row, rowIndex) => 
    row.map((cell, colIndex) => {
      if (cell.value === value && (rowIndex !== excludeRow || colIndex !== excludeCol)) {
        return { ...cell, isSameNumber: true };
      }
      return cell;
    })
  );
};

/**
 * Highlights the row and column of the selected cell
 */
export const highlightRowAndColumn = (board: Board, selectedRow: number, selectedCol: number): Board => {
  return board.map((row, rowIndex) => 
    row.map((cell, colIndex) => ({
      ...cell,
      isHighlightedRow: rowIndex === selectedRow && colIndex !== selectedCol,
      isHighlightedColumn: colIndex === selectedCol && rowIndex !== selectedRow
    }))
  );
};

/**
 * Selects a cell and applies all highlighting
 */
export const selectCell = (board: Board, rowIndex: number, colIndex: number): Board => {
  let newBoard = clearBoardHighlighting(board);
  
  // Select the cell
  newBoard[rowIndex][colIndex] = {
    ...newBoard[rowIndex][colIndex],
    isSelected: true
  };
  
  // Highlight row and column
  newBoard = highlightRowAndColumn(newBoard, rowIndex, colIndex);
  
  // Highlight same numbers
  const selectedValue = newBoard[rowIndex][colIndex].value;
  if (selectedValue !== null) {
    newBoard = highlightSameNumbers(newBoard, selectedValue, [rowIndex, colIndex]);
  }
  
  return newBoard;
};

/**
 * Clears all invalid cell markings
 */
export const clearInvalidCells = (board: Board): Board => {
  return board.map(row => 
    row.map(cell => ({
      ...cell,
      isInvalid: false
    }))
  );
};

/**
 * Checks if all cells in the board are filled
 */
export const isBoardFilled = (board: Board): boolean => {
  return board.every(row => 
    row.every(cell => cell.value !== null)
  );
};

/**
 * Creates a copy of the board with only fixed cells preserved
 */
export const createBoardWithFixedCells = (board: Board): Board => {
  return board.map(row =>
    row.map(cell => ({
      ...cell,
      value: cell.isFixed ? cell.value : null,
      notes: [],
      isInvalid: false
    }))
  );
};
