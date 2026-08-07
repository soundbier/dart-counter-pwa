import React from 'react';
import './SettingsScreen.css';

interface Player {
  id: string;
  name: string;
}

interface SettingsScreenProps {
  onBackToHome: () => void;
  players?: Player[];
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBackToHome, players = [] }) => {
  const displayPlayers = players.length > 0 ? players : [
    { id: '1', name: 'Marie' },
    { id: '2', name: 'Lukas' }
  ];

  return (
    <div className="screen-wrapper">
      <div className="screen-header">
        <button className="btn-back" onClick={onBackToHome}>← Zurück</button>
        <h2 className="screen-title">Einstellungen</h2>
        <div style={{ flex: 1 }}></div>
      </div>

      <div className="settings-section">
        <div className="section-title">Spieler Verwalten</div>
        <div className="settings-card">
          {displayPlayers.map(player => (
            <div key={player.id} className="settings-item">
              <span className="player-name">{player.name}</span>
              <button className="btn-danger-outline">Löschen</button>
            </div>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <div className="section-title">Daten & Speicher</div>
        <div className="settings-card">
          <button className="btn-danger-full">Alle Daten zurücksetzen</button>
        </div>
      </div>

      <div className="settings-section">
        <div className="section-title">Über die App</div>
        <div className="settings-card info-card">
          <div className="info-title">Dart Counter PWA</div>
          <div className="info-sub">Optimiert für iPhone & Mobile Touch</div>
        </div>
      </div>
    </div>
  );
};
