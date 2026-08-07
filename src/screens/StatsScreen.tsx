import React from 'react';
import './StatsScreen.css';

interface Player {
  id: string;
  name: string;
  ppd?: string | number;
  games?: number;
  wins?: number;
  highCheckout?: number;
  totalPoints?: number;
}

interface StatsScreenProps {
  onBack: () => void;
  players?: Player[];
}

export const StatsScreen: React.FC<StatsScreenProps> = ({ onBack, players = [] }) => {
  // Fallback, falls (noch) keine echten Spielerdaten aus der App übergeben werden
  const displayPlayers = players.length > 0 ? players : [
    { id: '1', name: 'Marie', ppd: '0.0', games: 0, wins: 0, highCheckout: 0, totalPoints: 0 },
    { id: '2', name: 'Lukas', ppd: '0.0', games: 0, wins: 0, highCheckout: 0, totalPoints: 0 }
  ];

  return (
    <div className="screen-wrapper">
      <div className="screen-header">
        <button className="btn-back" onClick={onBack}>← Zurück</button>
        <h2 className="screen-title">Statistiken</h2>
        <button className="btn-action">CSV Export</button>
      </div>

      <div className="stats-content">
        {displayPlayers.map(player => (
          <div key={player.id} className="stat-card">
            <div className="stat-card-header">{player.name}</div>
            
            <div className="stat-grid">
              <div className="stat-box">
                <span className="stat-label">Average (PPD)</span>
                <span className="stat-value">{player.ppd || '0.0'}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Spiele (G / W)</span>
                <span className="stat-value">{player.games || '0'} / {player.wins || '0'}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">High Checkout</span>
                <span className="stat-value">{player.highCheckout || '0'}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Gesamtpunkte</span>
                <span className="stat-value">{player.totalPoints || '0'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
