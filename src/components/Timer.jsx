import React, { useState, useEffect } from "react";

const Timer = ({ onTimeUpdate }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

 useEffect(() => {
  if (typeof onTimeUpdate === 'function') {
    onTimeUpdate(seconds);
  }}, [seconds, onTimeUpdate]);

  const formatTime = () => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return <span>{formatTime()}</span>;
};

export default Timer;
