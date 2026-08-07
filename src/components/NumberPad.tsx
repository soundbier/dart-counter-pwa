import React, { useState } from 'react';
import './NumberPad.css';

interface NumberPadProps {
  onScoreInput: (value: number, isDouble: boolean) => void;
  onDelete: () => void;
}

type Multiplier = 1 | 2 | 3;

export const NumberPad: React.FC<NumberPadProps> = ({ onScoreInput, onDelete }) => {
  const [multiplier, setMultiplier] = useState<Multiplier>(1);

  const toggleMultiplier = (selected: 2 | 3) => {
    if (multiplier === selected) {
      setMultiplier(1);
    } else {
      setMultiplier(selected);
    }
  };

  const handleNumberClick = (baseValue: number) => {
    let isDouble = multiplier === 2;
    let finalScore = baseValue * multiplier;

    // Spezialfall Bull: 25 x 2 (Double) wird zu 50 (Bulls) -> zählt als Double Bull
    if (baseValue === 25) {
      if (multiplier === 2) {
        finalScore = 50;
        isDouble = true;
      } else {
        finalScore = 25;
        isDouble = false;
      }
    }

    onScoreInput(finalScore, isDouble);
    setMultiplier(1); // Nach Wurf zurück auf Single
  };

  return (
    <div className="numberpad-container">
      {/* Multiplikator-Leiste */}
      <div className="multiplier-bar">
        <button 
          className={`btn-multiplier double ${multiplier === 2 ? 'active' : ''}`}
          onClick={() => toggleMultiplier(2)}
        >
          Double (2x)
        </button>
        <button 
          className={`btn-multiplier triple ${multiplier === 3 ? 'active' : ''}`}
          onClick={() => toggleMultiplier(3)}
        >
          Triple (3x)
        </button>
      </div>

      {/* Zahlen-Grid (1 bis 20) */}
      <div className="number-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((num) => (
          <button
            key={num}
            className="btn-num"
            onClick={() => handleNumberClick(num)}
          >
            {num}
          </button>
        ))}

        {/* 0 / Miss */}
        <button className="btn-num special" onClick={() => handleNumberClick(0)}>
          0 / Miss
        </button>

        {/* Bull-Button */}
        <button 
          className={`btn-num special bull ${multiplier === 2 ? 'bullseye' : ''}`}
          onClick={() => handleNumberClick(25)}
        >
          {multiplier === 2 ? '50 (Bulls)' : '25 (Outer)'}
        </button>

        {/* Löschen */}
        <button className="btn-num delete" onClick={onDelete}>
          ⌫ Löschen
        </button>
      </div>
    </div>
  );
};
