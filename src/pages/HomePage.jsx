import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'; // Separate CSS file for styles

export default function HomePage() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Simulating loading animation effect
    setTimeout(() => {
      setProgress(75); // Example value, can be updated from database
      setStreak(5); // Example value, can be updated from database
    }, 1000);
  }, []);

  return (
    <div className="homepage-container">
      <div className="overlay">
        <h1 className="title">Welcome to Sudoku</h1>

        {/* Animated New Game Button */}
        <button onClick={() => navigate('/game')} className="btn new-game-btn">
          🎲 New Game
        </button>

        {/* Progress and Streak Section */}
        <div className="progress-container">
          <p>📊 Progress: <span className="highlight">{progress}%</span></p>
          <p>🔥 Streak: <span className="highlight">{streak} Days</span></p>
        </div>

        {/* Leaderboard Button */}
        <button onClick={() => navigate('/leaderboard')} className="btn leaderboard-btn">
          🏆 Leaderboard
        </button>
      </div>
    </div>
  );
}

