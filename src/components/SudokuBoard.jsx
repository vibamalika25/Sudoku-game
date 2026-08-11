import React from 'react';
import './SudokuBoard.css';
import { getCellBorderStyle } from '../utils/puzzleGenerator';

export default function SudokuBoard({ board, onCellClick, selectedCell }) {
  return (
    <div className="board-container">
      <div className="board">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isSelected =
              selectedCell?.row === rowIndex && selectedCell?.col === colIndex;

            // Determine alternating 3x3 box color
            const boxColorClass =
              (Math.floor(rowIndex / 3) + Math.floor(colIndex / 3)) % 2 === 0
                ? 'box-color-1'
                : 'box-color-2';

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                style={getCellBorderStyle(rowIndex, colIndex)}
                className={`cell
                  ${boxColorClass}
                  ${cell.prefilled ? 'prefilled' : ''}
                  ${isSelected ? 'selected' : ''}
                  ${cell.wrong ? 'wrong-input' : ''}`}
                onClick={() =>
                  !cell.prefilled && onCellClick(rowIndex, colIndex)
                }
              >
                {cell.value || ''}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

