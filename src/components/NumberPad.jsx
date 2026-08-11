import React from 'react';
import '../components/NumberPad.css'


export default function NumberPad({ onNumberClick, onErase, onHint, numberCounts }) {
  return (
    <div className="number-pad-container">
      {/* Number Buttons with Counts */}
      <div className="number-buttons">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <div key={num} className="number-btn-container">
            <button className="number-btn" onClick={() => onNumberClick(num)}>
              {num}
            </button>
            <div className="number-count">{numberCounts[num]}</div>
          </div>
        ))}
      </div>

      {/* Control Buttons */}
      <div className="controls">
        <button className="btn btn-erase" onClick={onErase}>Erase</button>
        <button className="btn btn-hint" onClick={onHint}>Hint</button>
      </div>
    </div>
  );
}

