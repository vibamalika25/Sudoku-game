import React, { useEffect, useState } from "react";
import './Leaderboard.css';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const storedLeaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    setLeaderboard(storedLeaderboard);
  }, []);

  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">🏆 Leaderboard</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Time (s)</th>
            <th>Points</th>
            <th>🔥 Streak</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.length === 0 ? (
            <tr><td colSpan="5">No scores yet! Play a game to get started.</td></tr>
          ) : (
            leaderboard.map((player, index) => (
              <tr key={index}>
                <td>#{index + 1}</td>
                <td>{player.name || "Player"}</td>
                <td>{player.time}s</td>
                <td>{player.points}</td>
                <td>{player.streak} Days</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
