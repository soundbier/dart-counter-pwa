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
  outMode?: 'single' | 'double'; // Standard: 'double'
  onGameEnd?: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ outMode = 'double' }) => {
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'Spieler 1', score: 501, legs: 0, sets: 0 },
    { id: '2', name: 'Spieler 2', score: 501, legs: 0, sets: 0 },
  ]);

  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);
  const [turnStartScore, setTurnStartScore] = useState<number>(501);
  const [turnDarts, setTurnDarts] = useState<number[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const currentPlayer = players[activePlayerIndex];

  const triggerVibration = (pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Fallback
      }
    }
  };

  const handleScoreInput = (score: number, isDouble: boolean) => {
    setMessage(null);
    const newRemaining = currentPlayer.score - score;
    const isDoubleOut = outMode === 'double';

    // 1. BUST (Überworfen) Prüfungen:
    // - Punkte unter 0
    // - Rest 1 bei Double Out (kann nicht ausgecheckt werden)
    // - Rest 0 ohne Double bei Double Out
    const isBust = 
      newRemaining < 0 || 
      (isDoubleOut && newRemaining === 1) || 
      (newRemaining === 0 && isDoubleOut && !isDouble);

    if (isBust) {
      // Bust-Feedback
      triggerVibration([100, 50, 100]);
      setMessage('Bust! (Überworfen)');

      // Score auf Rundenanfang zurücksetzen
      setPlayers((prev) =>
        prev.map((p, idx) =>
          idx === activePlayerIndex ? { ...p, score: turnStartScore } : p
        )
      );

      // Nächster Spieler ist dran
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
            ? { ...p, score: 501, legs: p.legs + 1 }
            : { ...p, score: 501 }
        )
      );

      setTurnDarts([]);
      setTurnStartScore(501);
      return;
    }

    // 3. Gültiger Wurf
    triggerVibration(30); // Sanftes Tipp-Feedback

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
