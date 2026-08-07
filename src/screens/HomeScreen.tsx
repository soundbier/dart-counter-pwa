import React from 'react';
import './HomeScreen.css';

interface HomeScreenProps {
  onStartNewGame: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartNewGame,
  onOpenStats,
  onOpenSettings,
}) => {
  return (
    <div className="home-container">
      <div className="home-header">
        <div className="logo-icon">🎯</div>
        <h1>Dart Counter</h1>
        <p className="subtitle">Professional PWA Experience</p>
      </div>

      <div className="home-actions">
        <button className="btn-primary-home" onClick={onStartNewGame}>
          Neues Spiel
        </button>
        <button className="btn-secondary-home" onClick={onOpenStats}>
          Statistiken
        </button>
        <button className="btn-secondary-home" onClick={onOpenSettings}>
          Einstellungen
        </button>
      </div>

      <div className="home-footer">
        <span>v1.0.0 • MVP</span>
      </div>
    </div>
  );
};
