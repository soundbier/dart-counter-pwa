import React, { useState } from 'react';
import './HomeScreen.css';
import { PlayerModal } from '../components/PlayerModal';

interface HomeScreenProps {
  // Das ist die Funktion, die von der App.tsx übergeben wird, um das Spiel zu starten
  onStartGame?: (players: string[]) => void; 
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStartGame }) => {
  const [showModal, setShowModal] = useState(false);

  const handleStartGame = (players: string[]) => {
    setShowModal(false);
    if (onStartGame) {
      onStartGame(players);
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
        {/* Hier öffnen wir jetzt das Modal! */}
        <button className="btn-menu-primary" onClick={() => setShowModal(true)}>
          Neues Spiel
        </button>
        <button className="btn-menu-secondary">
          Statistiken
        </button>
        <button className="btn-menu-secondary">
          Einstellungen
        </button>
      </div>

      <div className="home-footer">
        v1.0.0 • MVP
      </div>

      {/* Das Modal wird nur angezeigt, wenn showModal auf "true" steht */}
      {showModal && (
        <PlayerModal 
          onClose={() => setShowModal(false)} 
          onStart={handleStartGame} 
        />
      )}
    </div>
  );
};
