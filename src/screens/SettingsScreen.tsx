import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { Player } from '../types';
import './SettingsScreen.css';

interface SettingsScreenProps {
  onBackToHome: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBackToHome }) => {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    const allPlayers = await db.players.toArray();
    setPlayers(allPlayers);
  };

  const handleDeletePlayer = async (id: string) => {
    if (window.confirm('Möchtest du diesen Spieler wirklich löschen?')) {
      await db.players.delete(id);
      loadPlayers();
    }
  };

  const handleClearAllData = async () => {
    if (window.confirm('ACHTUNG: Alle Spieldaten und Spieler werden unwiderruflich gelöscht! Fortfahren?')) {
      await db.players.clear();
      await db.games.clear();
      loadPlayers();
      alert('Alle Daten wurden gelöscht.');
    }
  };

  return (
    <div className="settings-screen">
      <div className="settings-header">
        <button className="btn-back" onClick={onBackToHome}>← Zurück</button>
        <h2>Einstellungen</h2>
        <div style={{ width: 40 }}></div>
      </div>

      <div className="settings-content">
        {/* Sektion: Spielerverwaltung */}
        <div className="settings-section">
          <h3>Spieler verwalten</h3>
          {players.length === 0 ? (
            <p className="settings-hint">Keine Spieler vorhanden.</p>
          ) : (
            <div className="settings-player-list">
              {players.map(player => (
                <div key={player.id} className="settings-player-item">
                  <span>{player.name}</span>
                  <button 
                    className="btn-delete-player" 
                    onClick={() => handleDeletePlayer(player.id)}
                  >
                    Löschen
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sektion: Daten & Speicher */}
        <div className="settings-section">
          <h3>Daten & Speicher</h3>
          <button className="btn-danger" onClick={handleClearAllData}>
            Alle Daten zurücksetzen
          </button>
        </div>

        {/* Sektion: App-Info */}
        <div className="settings-section">
          <h3>Über die App</h3>
          <div className="app-info-card">
            <p><strong>Dart Counter PWA</strong></p>
            <p className="settings-hint">Version 1.0.0 • MVP</p>
            <p className="settings-hint">Optimiert für iPhone & Mobile Touch</p>
          </div>
        </div>
      </div>
    </div>
  );
};
