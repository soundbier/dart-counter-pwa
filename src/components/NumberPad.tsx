import React, { useState } from 'react';
import './NumberPad.css';

interface NumberPadProps {
  onScoreInput: (value: number) => void;
  onDelete: () => void;
  onSubmit?: () => void; // Optional für Abwärtskompatibilität mit GameScreen
}

type Multiplier = 1 | 2 | 3;

export const NumberPad: React.FC<NumberPadProps> = ({ onScoreInput, onDelete, onSubmit }) => {
  const [multiplier, setMultiplier] = useState<Multiplier>(1);
  const [dartCount, setDartCount] = useState<number>(0);

  // Umschalten von Double (2x) oder Triple (3x)
  const toggleMultiplier = (selected: 2 | 3) => {
    if (multiplier === selected) {
      setMultiplier(1);
    } else {
      setMultiplier(selected);
    }
  };

  const handleNumberClick = (baseValue: number) => {
    let finalScore = baseValue * multiplier;

    // Special Bull Logic (25 x 2 = 50)
    if (baseValue === 25) {
      finalScore = multiplier === 2 ? 50 : 25;
    }

    onScoreInput(finalScore);
    setMultiplier(1);

    const nextCount = dartCount + 1;

    // Nach dem 3. Wurf automatisch abschließen & vibrieren
    if (nextCount >= 3) {
      // Haptisches Feedback (leichtes Vibrieren)
      if ('vibrate' in navigator) {
        try {
          navigator.vibrate(40); // 40ms kurzes Feedback
        } catch {
          // Fallback falls vom Gerät/Browser blockiert
        }
      }

      if (onSubmit) {
        onSubmit();
      }
      setDartCount(0);
    } else {
      setDartCount(nextCount);
    }
  };

  const handleDelete = () => {
    onDelete();
    setDartCount((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="numberpad-container">
      {/* Multiplikator-Leiste (Double & Triple) */}
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

        {/* Bull-Button (dynamisch 25 / 50) */}
        <button 
          className={`btn-num special bull ${multiplier === 2 ? 'bullseye' : ''}`}
          onClick={() => handleNumberClick(25)}
        >
          {multiplier === 2 ? '50 (Bulls)' : '25 (Outer)'}
        </button>

        {/* Löschen */}
        <button className="btn-num delete" onClick={handleDelete}>
          ⌫ Löschen
        </button>
      </div>
    </div>
  );
};
