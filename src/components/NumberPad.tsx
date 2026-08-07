import React from 'react';
import './NumberPad.css';

interface NumberPadProps {
  onScoreInput: (score: number, isDouble: boolean) => void;
  onDelete: () => void;
  isDouble?: boolean;
  isTriple?: boolean;
  onToggleDouble?: () => void;
  onToggleTriple?: () => void;
}

export const NumberPad: React.FC<NumberPadProps> = ({
  onScoreInput,
  onDelete,
  isDouble = false,
  isTriple = false,
  onToggleDouble,
  onToggleTriple,
}) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  const handleNumClick = (num: number) => {
    let multiplier = 1;
    if (isDouble) multiplier = 2;
    if (isTriple) multiplier = 3;
    onScoreInput(num * multiplier, isDouble);
  };

  return (
    <div className="numberpad-container">
      {/* Multiplikator-Leiste (Double / Triple) */}
      <div className="multiplier-bar">
        <button 
          className={`btn-multiplier ${isDouble ? 'active' : ''}`}
          onClick={onToggleDouble}
        >
          Double (2x)
        </button>
        <button 
          className={`btn-multiplier ${isTriple ? 'active' : ''}`}
          onClick={onToggleTriple}
        >
          Triple (3x)
        </button>
      </div>

      {/* Das Haupt-Zahlenraster */}
      <div className="number-grid">
        {numbers.map((num) => (
          <button 
            key={num} 
            className="btn-num"
            onClick={() => handleNumClick(num)}
          >
            {num}
          </button>
        ))}

        {/* Untere Sonder-Buttons: Perfekt aufgeteilt auf die letzten Plätze */}
        <button 
          className="btn-num special" 
          onClick={() => onScoreInput(0, false)}
        >
          0 / Miss
        </button>
        
        <button 
          className="btn-num special" 
          onClick={() => onScoreInput(25, false)}
        >
          25 (Outer)
        </button>

        <button 
          className="btn-num delete" 
          onClick={onDelete}
        >
          ⌫ Löschen
        </button>
      </div>
    </div>
  );
};
