import React, { useState } from 'react';
import './NumberPad.css';

interface NumberPadProps {
  onScoreInput: (value: number) => void;
  onDelete: () => void;
  onSubmit: () => void;
}

type Multiplier = 1 | 2 | 3;

export const NumberPad: React.FC<NumberPadProps> = ({ onScoreInput, onDelete, onSubmit }) => {
  const [multiplier, setMultiplier] = useState<Multiplier>(1);

  // Umschalten von Double (2x) oder Triple (3x)
  const toggleMultiplier = (selected: 2 | 3) => {
    if (multiplier === selected) {
      setMultiplier(1); // Bei erneutem Klick deaktivieren -> zurück zu Single
    } else {
      setMultiplier(selected);
    }
  };

  const handleNumberClick = (baseValue: number) => {
    let finalScore = baseValue * multiplier;

    // Spezialfall Bull: 25 x 2 (Double) wird zu 50 (Bulls). Bei Triple bleibt es 25 (Standard-Bull).
    if (baseValue === 25) {
      finalScore = multiplier === 2 ? 50 : 25;
    }

    onScoreInput(finalScore);
    
    // Nach jeder Eingabe automatisch wieder auf Single zurücksetzen!
    setMultiplier(1);
  };

  return (
    <div className="numberpad-container">
      {/* Multiplikator-Leiste (nur noch Double & Triple) */}
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

        {/* Dynamischer Bull-Button: Verwandelt sich bei Double in "50 (Bulls)" */}
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

      {/* Bestätigen-Button */}
      <button className="btn-submit-score" onClick={onSubmit}>
        Wurf bestätigen
      </button>
    </div>
  );
};
