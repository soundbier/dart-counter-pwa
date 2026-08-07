import React from 'react';
import './NumberPad.css';

interface NumberPadProps {
  onScoreInput: (value: number) => void;
  onDelete: () => void;
  onSubmit: () => void;
}

export const NumberPad: React.FC<NumberPadProps> = ({ onScoreInput, onDelete, onSubmit }) => {
  // Häufige High-Score Felder als Schnellzugriff oben
  const quickNumbers = [20, 19, 18, 17, 16];

  // Standard-Zahlenfeld (0-9)
  const padNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  return (
    <div className="number-pad">
      {/* Schnellzugriff oben */}
      <div className="quick-access-row">
        {quickNumbers.map((num) => (
          <button
            key={num}
            className="pad-btn quick-btn"
            onClick={() => onScoreInput(num)}
          >
            {num}
          </button>
        ))}
      </div>

      {/* Haupt-Zahlenpad */}
      <div className="main-pad-grid">
        {padNumbers.map((num) => (
          <button
            key={num}
            className={`pad-btn number-btn ${num === 0 ? 'zero-btn' : ''}`}
            onClick={() => onScoreInput(num)}
          >
            {num}
          </button>
        ))}
        <button className="pad-btn action-btn delete-btn" onClick={onDelete}>
          ⌫
        </button>
        <button className="pad-btn action-btn submit-btn" onClick={onSubmit}>
          OK
        </button>
      </div>
    </div>
  );
};
