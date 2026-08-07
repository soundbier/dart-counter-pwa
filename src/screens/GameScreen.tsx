import React, { useState, useEffect } from 'react';
import { GameMode, Player } from '../types';
import { db } from '../db';
import { getInitialScore, processRound } from '../game_logic';
import { NumberPad } from '../components/NumberPad';
import './GameScreen.css';

interface GameScreenProps {
  playerIds: string[];
  mode: GameMode;
  onGameOver: () => void;
  onBackToHome: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  playerIds,
  mode,
  onGameOver,
  onBackToHome,
}) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);
  const [currentThrows, setCurrentThrows] = useState<number[]>([]);
  const [lastBustPlayerId, setLastBustPlayerId] = useState<string | null>(null);
  const [winnerName, setWinnerName] = useState<string | null>(null);

  // Spieler laden und Startpunkte initialisieren
  useEffect(() => {
    async function initGame() {
      const fetchedPlayers = await db.players.where(':id').anyOf(playerIds).toArray();
      setPlayers(fetchedPlayers);

      const initialScore = getInitialScore(mode);
      const initialScoresMap: Record<string, number> = {};
      fetchedPlayers.forEach(p => {
        initialScoresMap[p.id] = initialScore;
      });
      setScores(initialScoresMap);
    }
    initGame();
  }, [playerIds, mode]);

  const activePlayer = players[activePlayerIndex];

  // Zahl zum aktuellen Wurf hinzufügen (max 3 Darts pro Aufnahme)
  const handleScoreInput = (value: number) => {
    if (winnerName) return;
    if (currentThrows.length >= 3) return;
    setCurrentThrows(prev => [...prev, value]);
  };

  // Letzten Dart im aktuellen Wurf löschen
  const handleDeleteThrow = () => {
    setCurrentThrows(prev => prev.slice(0, -1));
  };

  // Aufnahme bestätigen (OK-Button)
  const handleSubmitRound = () => {
    if (!activePlayer || currentThrows.length === 0 || winnerName) return;

    const currentScore = scores[activePlayer.id];
    // Für Double-Out prüfen wir, ob der letzte Dart ein Double war (vereinfacht für MVP: wenn Wert * 2 oder standardmäßig false, sofern nicht anders definiert)
    // Hier übergeben wir den letzten Wurf als Indikator für Double-Out (z.B. wenn der Wurf verdoppelt wurde - im einfachen Pad nehmen wir an es ist ein normaler Treffer, außer es wird verfeinert).
    const isLastDartDouble = false; // Kann später erweitert werden

    const result = processRound(currentScore, currentThrows, mode, isLastDartDouble);

    if (result.isBust) {
      setLastBustPlayerId(activePlayer.id);
      setTimeout(() => setLastBustPlayerId(null), 2000);
    } else {
      setScores(prev => ({
        ...prev,
        [activePlayer.id]: result.remainingPoints,
      }));
    }

    if (result.isWin) {
      setWinnerName(activePlayer.name);
      return;
    }

    // Nächster Spieler
    setCurrentThrows([]);
    setActivePlayerIndex(prev => (prev + 1) % players.length);
  };

  if (players.length === 0) {
    return <div className="game-loading">Lade Spiel...</div>;
  }

  return (
    <div className="game-screen">
      {/* Top Bar: Spielstand pro Spieler */}
      <div className="game-header-bar">
        <button className="btn-back" onClick={onBackToHome}>✕ Beenden</button>
        <span className="game-mode-badge">{mode.toUpperCase()}</span>
      </div>

      <div className="players-scoreboard">
        {players.map((player, index) => {
          const isActive = index === activePlayerIndex;
          const isBust = lastBustPlayerId === player.id;
          return (
            <div
              key={player.id}
              className={`player-score-card ${isActive ? 'active' : ''}`}
            >
              <span className="player-name">{player.name}</span>
              <span className={`player-points ${isBust ? 'bust-text' : ''}`}>
                {isBust ? 'BUST' : scores[player.id]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mitte: Aktiver Spieler & Aktuelle Würfe */}
      <div className="current-turn-section">
        {winnerName ? (
          <div className="winner-announcement">
            <h2>🏆 {winnerName} gewinnt das Spiel!</h2>
            <button className="btn-primary" onClick={onBackToHome}>Zurück zum Start</button>
          </div>
        ) : (
          <>
            <div className="active-player-info">
              <span>Am Zug: <strong>{activePlayer?.name}</strong></span>
              <div className="throws-display">
                Darts: {currentThrows.length > 0 ? currentThrows.join(' • ') : 'Noch kein Wurf'}
              </div>
            </div>

            {/* Eingabe-Pad */}
            <NumberPad
              onScoreInput={handleScoreInput}
              onDelete={handleDeleteThrow}
              onSubmit={handleSubmitRound}
            />
          </>
        )}
      </div>
    </div>
  );
};
