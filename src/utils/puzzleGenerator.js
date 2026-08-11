// Generate a complete Sudoku puzzle and then remove some cells based on difficulty
export function generateSudoku(level = 'medium') {
  const SIZE = 9;

  // Check if placing num in grid[row][col] is safe
  const isSafe = (grid, row, col, num) => {
    for (let i = 0; i < SIZE; i++) {
      if (grid[row][i] === num || grid[i][col] === num) return false;
    }
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (grid[startRow + r][startCol + c] === num) return false;
      }
    }
    return true;
  };

  // Backtracking function to fill the grid
  const fillGrid = (grid) => {
    const empty = findEmptyCell(grid);
    if (!empty) return true;
    const [row, col] = empty;
    const numbers = [...Array(9)].map((_, i) => i + 1).sort(() => Math.random() - 0.5);
    for (let num of numbers) {
      if (isSafe(grid, row, col, num)) {
        grid[row][col] = num;
        if (fillGrid(grid)) return true;
        grid[row][col] = 0;
      }
    }
    return false;
  };

  // Find an empty cell in the grid (value 0)
  const findEmptyCell = (grid) => {
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        if (grid[row][col] === 0) return [row, col];
      }
    }
    return null;
  };

  // Remove numbers from the solved grid based on difficulty
  const removeCells = (grid, minKeep, maxKeep) => {
    let puzzle = grid.map(row => [...row]);
    let filledCells = SIZE * SIZE;
    let targetFilledCells = Math.floor(Math.random() * (maxKeep - minKeep + 1)) + minKeep;
    while (filledCells > targetFilledCells) {
      let row = Math.floor(Math.random() * SIZE);
      let col = Math.floor(Math.random() * SIZE);
      if (puzzle[row][col] !== null) {
        puzzle[row][col] = null;
        filledCells--;
      }
    }
    return puzzle;
  };

  // Generate a complete grid, then remove some cells based on difficulty
  let sudoku = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  fillGrid(sudoku);
  let solution = sudoku.map(row => [...row]); // Full solution

  let difficultyLevels = {
    easy: { minKeep: 40, maxKeep: 50 },
    medium: { minKeep: 32, maxKeep: 39 },
    hard: { minKeep: 22, maxKeep: 28 }
  };

  let { minKeep, maxKeep } = difficultyLevels[level] || difficultyLevels['medium'];
  let puzzle = removeCells(solution, minKeep, maxKeep);

  return { puzzle, solution };
}

// Check for conflicts in the row, column, or 3x3 box
export function checkConflict(grid, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if ((grid[row][i] === num && i !== col) || (grid[i][col] === num && i !== row)) {
      return true;
    }
  }
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const currentRow = startRow + r;
      const currentCol = startCol + c;
      if (grid[currentRow][currentCol] === num && (currentRow !== row || currentCol !== col)) {
        return true;
      }
    }
  }
  return false;
}

// Provide a hint: return the correct number for a given cell if it's empty
export function getHint(board, solution, row, col) {
  if (!board || !solution) return null;
  if (board[row][col] !== null) return null; // Only hint for empty cells
  return solution[row][col];
}

// Erase a cell's content (immutable update)
export function eraseCell(board, row, col) {
  if (!board || !board[row] || !board[row][col]) return board;
  if (board[row][col].prefilled) return board; // Do not erase prefilled cells

  const newBoard = board.map((r, rIdx) =>
    r.map((cell, cIdx) =>
      rIdx === row && cIdx === col ? { ...cell, value: null, wrong: false } : cell
    )
  );
  return newBoard;
}

// Apply hint to a cell (if needed)
export function applyHint(board, solution, row, col) {
  if (board[row][col] === null) {
    board[row][col] = solution[row][col];
  }
  return board;
}

// Grid cell styling for 3x3 borders
export const getCellBorderStyle = (row, col) => ({
  borderTop: row % 3 === 0 ? '3px solid black' : '1px solid #999',
  borderLeft: col % 3 === 0 ? '3px solid black' : '1px solid #999',
  borderRight: (col + 1) % 3 === 0 ? '3px solid black' : '1px solid #999',
  borderBottom: (row + 1) % 3 === 0 ? '3px solid black' : '1px solid #999',
});
