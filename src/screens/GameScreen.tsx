import React, { useState } from 'react';
import { NumberPad } from '../components/NumberPad';
import './GameScreen.css';

interface Player {
  id: string;
  name: string;
  score: number;
  legs: number;
  sets: number;
}

interface GameScreenProps {
  playerIds?: string[];
  mode?: any;
  outMode?: 'single' | 'double';
  startingScore?: number;
  onGameOver?: () => void;
  onBackToHome?: () => void;
  onGameEnd?: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  playerIds,
  mode,
  outMode = 'double',
  startingScore = 501,
  onGameOver,
  onBackToHome,
  onGameEnd,
}) => {
  // Spieler basierend auf übergebenen IDs initialisieren
  const [players, setPlayers] = useState<Player[]>(() => {
    if (playerIds && playerIds.length > 0) {
      return playerIds.map((id, index) => ({
        id,
        name: `Spieler ${index + 1}`,
        score: startingScore,
        legs: 0,
        sets: 0,
      }));
    }
    return [
      { id: '1', name: 'Spieler 1', score: startingScore, legs: 0, sets: 0 },
      { id: '2', name: 'Spieler 2', score: startingScore, legs: 0, sets: 0 },
    ];
  });

  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);
  const [turnStartScore, setTurnStartScore] = useState<number>(startingScore);
  const [turnDarts, setTurnDarts] = useState<number[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const currentPlayer = players[activePlayerIndex];

  const triggerVibration = (pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Fallback falls vom Gerät nicht unterstützt
      }
    }
  };

  const handleScoreInput = (score: number, isDouble: boolean) => {
    setMessage(null);
    const newRemaining = currentPlayer.score - score;
    const isDoubleOut = outMode === 'double';

    // 1. BUST (Überworfen) Prüfungen
    const isBust = 
      newRemaining < 0 || 
      (isDoubleOut && newRemaining === 1) || 
      (newRemaining === 0 && isDoubleOut && !isDouble);

    if (isBust) {
      triggerVibration([100, 50, 100]);
      setMessage('Bust! (Überworfen)');

      setPlayers((prev) =>
        prev.map((p, idx) =>
          idx === activePlayerIndex ? { ...p, score: turnStartScore } : p
        )
      );

      switchTurn();
      return;
    }

    // 2. CHECKOUT / LEG GEWONNEN!
    if (newRemaining === 0) {
      triggerVibration([150, 50, 150, 50, 300]);
      setMessage(`🎉 ${currentPlayer.name} hat das Leg gewonnen!`);

      setPlayers((prev) =>
        prev.map((p, idx) =>
          idx === activePlayerIndex
            ? { ...p, score: startingScore, legs: p.legs + 1 }
            : { ...p, score: startingScore }
        )
      );

      setTurnDarts([]);
      setTurnStartScore(startingScore);

      if (onGameOver) {
        onGameOver();
      } else if (onGameEnd) {
        onGameEnd();
      }
      return;
    }

    // 3. Gültiger Wurf
    triggerVibration(30);

    const nextDarts = [...turnDarts, score];

    setPlayers((prev) =>
      prev.map((p, idx) =>
        idx === activePlayerIndex ? { ...p, score: newRemaining } : p
      )
    );

    // Nach 3 Würfen -> automatischer Spielerwechsel
    if (nextDarts.length >= 3) {
      switchTurn();
    } else {
      setTurnDarts(nextDarts);
    }
  };

  const switchTurn = () => {
    const nextIndex = (activePlayerIndex + 1) % players.length;
    setActivePlayerIndex(nextIndex);
    setTurnDarts([]);
    setTurnStartScore(players[nextIndex].score);
  };

  const handleDelete = () => {
    if (turnDarts.length === 0) return;

    const lastDartScore = turnDarts[turnDarts.length - 1];
    const updatedDarts = turnDarts.slice(0, -1);

    setPlayers((prev) =>
      prev.map((p, idx) =>
        idx === activePlayerIndex ? { ...p, score: p.score + lastDartScore } : p
      )
    );

    setTurnDarts(updatedDarts);
  };

  return (
    <div className="game-screen">
      {onBackToHome && (
        <button className="btn-back" onClick={onBackToHome}>
          ← Zurück zum Hauptmenü
        </button>
      )}

      <div className="player-board">
        {players.map((player, idx) => (
          <div
            key={player.id}
            className={`player-card ${idx === activePlayerIndex ? 'active' : ''}`}
          >
            <h2>{player.name}</h2>
            <div className="score">{player.score}</div>
            <div className="stats">Legs: {player.legs}</div>
          </div>
        ))}
      </div>

      {message && <div className="game-message">{message}</div>}

      <div className="turn-info">
        <span>Geworfen: {turnDarts.join(' | ') || '—'}</span>
      </div>

      <NumberPad onScoreInput={handleScoreInput} onDelete={handleDelete} />
    </div>
  );
};
