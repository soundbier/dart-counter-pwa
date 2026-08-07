import React, { useState } from 'react';
import './NumberPad.css';

interface NumberPadProps {
  onScoreSubmit: (score: number) => void;
  onBackSpace: () => void;
}

type Multiplier = 1 | 2 | 3;

export const NumberPad: React.FC<NumberPadProps> = ({ onScoreSubmit, onBackSpace }) => {
  const [multiplier, setMultiplier] = useState<Multiplier>(1);

  const handleNumberClick = (baseValue: number) => {
    let finalScore = baseValue * multiplier;
    // Wenn Bullseye (25) mit Triple geklickt wird, gibt es im Standard-Steeldarts kein Triple-Bull (maximal 50/Double Bull oder 25 Single Bull). 
    // Wir lassen es logisch zu (25 * 3 = 75), fangen es aber sauber ab falls nötig.
    if (baseValue === 50) {
      finalScore = 50; // Outer/Inner Bull direkt
    } else if (baseValue === 25) {
      finalScore = 25 * multiplier; // 25 oder 50 (bei Double 25)
    }

    onScoreSubmit(finalScore);
    // Multiplier nach Wurf automatisch auf Single zurücksetzen (optional, sehr komfortabel)
    setMultiplier(1);
  };

  return (
    <div className="numberpad-container">
      {/* Multiplikator-Leiste (Single, Double, Triple) */}
      <div className="multiplier-bar">
        <button 
          className={`btn-multiplier ${multiplier === 1 ? 'active' : ''}`}
          onClick={() => setMultiplier(1)}
        >
          Single (1x)
        </button>
        <button 
          className={`btn-multiplier double ${multiplier === 2 ? 'active' : ''}`}
          onClick={() => setMultiplier(2)}
        >
          Double (2x)
        </button>
        <button 
          className={`btn-multiplier triple ${multiplier === 3 ? 'active' : ''}`}
          onClick={() => setMultiplier(3)}
        >
          Triple (3x)
        </button>
      </div>

      {/* Zahlen-Grid (1 bis 20 + Bull + 0) */}
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

        {/* Sonderfelder: 0 (Miss), 25 (Outer Bull), 50 (Bullseye) */}
        <button className="btn-num special" onClick={() => handleNumberClick(0)}>
          0 / Miss
        </button>
        <button className="btn-num special bull" onClick={() => handleNumberClick(25)}>
          25 (Outer)
        </button>
        <button className="btn-num special bullseye" onClick={() => handleNumberClick(50)}>
          50 (Bull)
        </button>

        {/* Löschen / Korrektur */}
        <button className="btn-num delete" onClick={onBackSpace}>
          ⌫ Löschen
        </button>
      </div>
    </div>
  );
};
