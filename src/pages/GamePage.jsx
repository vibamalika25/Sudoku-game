import React, { useState, useEffect } from 'react';
import { generateSudoku, checkConflict, eraseCell, getHint } from '../utils/puzzleGenerator';
import SudokuBoard from '../components/SudokuBoard';
import NumberPad from '../components/NumberPad';
import Timer from '../components/Timer';

export default function GamePage() {
  const [difficulty, setDifficulty] = useState('medium');
  const [board, setBoard] = useState([]);
  const [solution, setSolution] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [attempts, setAttempts] = useState(3);
  const [numberCounts, setNumberCounts] = useState({});
  const [gameStatus, setGameStatus] = useState('playing');

  useEffect(() => {
    const { puzzle, solution } = generateSudoku(difficulty);
    const formattedPuzzle = puzzle.map(row =>
      row.map(value => ({ value, prefilled: value !== null, wrong: false }))
    );

    setBoard(formattedPuzzle);
    setSolution(solution);

    const counts = {};
    for (let i = 1; i <= 9; i++) counts[i] = 9;
    puzzle.forEach(row =>
      row.forEach(cell => {
        if (cell !== null) counts[cell]--;
      })
    );
    setNumberCounts(counts);
  }, [difficulty]);

  const handleCellClick = (row, col) => {
    if (!board[row][col].prefilled && gameStatus === 'playing') {
      setSelectedCell({ row, col });
    }
  };

  const handleNumberClick = (number, override = false) => {
    if (!selectedCell || gameStatus !== 'playing') return;
    const { row, col } = selectedCell;
    const cell = board[row][col];

    if (cell.value !== null && !override) return;

    const isConflict = checkConflict(board.map(r => r.map(c => c.value)), row, col, number);
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));

    if (!isConflict && solution[row][col] === number) {
      newBoard[row][col] = { ...newBoard[row][col], value: number, wrong: false };
      setBoard(newBoard);

      const counts = { ...numberCounts };
      counts[number]--;
      setNumberCounts(counts);

      if (newBoard.every(row => row.every(cell => cell.value !== null))) {
        setGameStatus('completed');
        setTimeout(() => alert('🎉 Congratulations! You have completed the puzzle!'), 100);
      }
    } else if (!override) {
      newBoard[row][col] = { ...newBoard[row][col], value: number, wrong: true };
      setBoard(newBoard);
      setAttempts(prev => prev - 1);

      if (attempts - 1 <= 0) {
        setGameStatus('gameover');
        setTimeout(() => {
          if (window.confirm('Game over! Would you like to restart?')) {
            window.location.reload();
          }
        }, 100);
      }
    }
  };

  const handleErase = () => {
    if (!selectedCell || gameStatus !== 'playing') return;
    const { row, col } = selectedCell;

    if (!board || !board[row] || !board[row][col]) return;
    if (board[row][col].prefilled) return;

    const erasedValue = board[row][col].value;
    const newBoard = eraseCell(board, row, col);
    setBoard(newBoard);

    if (erasedValue) {
      setNumberCounts(prev => ({ ...prev, [erasedValue]: prev[erasedValue] + 1 }));
    }
  };

  const handleHint = () => {
    if (!selectedCell || gameStatus !== 'playing') return;
    const { row, col } = selectedCell;
    const correctNumber = solution[row][col];

    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    newBoard[row][col] = { ...newBoard[row][col], value: correctNumber, prefilled: true, wrong: false };
    setBoard(newBoard);

    const counts = { ...numberCounts };
    if (counts[correctNumber] > 0) counts[correctNumber]--;
    setNumberCounts(counts);
  };

  return (
    <div className="sudoku-container">
      <div className="game-info">
        <div className="difficulty-selector">
          <button onClick={() => setDifficulty('easy')}>Easy</button>
          <button onClick={() => setDifficulty('medium')}>Medium</button>
          <button onClick={() => setDifficulty('hard')}>Hard</button>
        </div>
        <div className="game-status">
          <span className="attempts">❤️ {attempts}</span>
          <span className="timer">⏳ <Timer /></span>
        </div>
      </div>

      <SudokuBoard board={board} onCellClick={handleCellClick} selectedCell={selectedCell} />
      <NumberPad onNumberClick={handleNumberClick} onErase={handleErase} onHint={handleHint} numberCounts={numberCounts} />

      {gameStatus === 'completed' && (
        <div className="text-center text-green-600 text-xl mt-4">🎉 Puzzle Completed!</div>
      )}
      {gameStatus === 'gameover' && (
        <div className="text-center text-red-600 text-xl mt-4">😢 Game Over!</div>
      )}
    </div>
  );
}