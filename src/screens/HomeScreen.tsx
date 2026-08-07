import React, { useState } from 'react';
import './HomeScreen.css';
import { PlayerModal } from '../components/PlayerModal';

interface HomeScreenProps {
  onStartNewGame?: (players?: string[]) => void;
  onOpenStats?: () => void;
  onOpenSettings?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ 
  onStartNewGame,
  onOpenStats,
  onOpenSettings
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleStartGame = (players: string[]) => {
    setShowModal(false);
    if (onStartNewGame) {
      onStartNewGame(players);
    }
  };

  return (
    <div className="home-screen">
      <div className="home-header">
        <div style={{ fontSize: '40px', marginBottom: '8px' }}>🎯</div>
        <h1 className="home-title">Dart Counter</h1>
        <p className="home-subtitle">Professional PWA Experience</p>
      </div>

      <div className="home-menu">
        <button className="btn-menu-primary" onClick={() => setShowModal(true)}>
          Neues Spiel
        </button>
        {/* Die neuen Eigenschaften werden hier direkt aufgerufen */}
        <button className="btn-menu-secondary" onClick={onOpenStats}>
          Statistiken
        </button>
        <button className="btn-menu-secondary" onClick={onOpenSettings}>
          Einstellungen
        </button>
      </div>

      <div className="home-footer">
        v1.0.0 • MVP
      </div>

      {showModal && (
        <PlayerModal 
          onClose={() => setShowModal(false)} 
          onStartGame={handleStartGame} 
        />
      )}
    </div>
  );
};
