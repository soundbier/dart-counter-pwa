import React, { useState, useEffect } from 'react';
import { Player } from '../types';
import { db } from '../db';
import './StatsScreen.css';

interface StatsScreenProps {
  onBackToHome: () => void;
}

export const StatsScreen: React.FC<StatsScreenProps> = ({ onBackToHome }) => {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    async function loadStats() {
      const allPlayers = await db.players.toArray();
      setPlayers(allPlayers);
    }
    loadStats();
  }, []);

  const handleExportCSV = () => {
    if (players.length === 0) return;
    const headers = ['Name', 'Games Played', 'Games Won', 'Total Throws', 'Total Points', 'Average (PPD)', 'Highest Checkout'];
    const rows = players.map(p => [
      p.name,
      p.lifetime.gamesPlayed,
      p.lifetime.gamesWon,
      p.lifetime.totalThrows,
      p.lifetime.totalPoints,
      p.lifetime.average.toFixed(2),
      p.lifetime.highestCheckout
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + 
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'dart_counter_stats.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="stats-screen">
      <div className="stats-header">
        <button className="btn-back" onClick={onBackToHome}>← Zurück</button>
        <h2>Statistiken</h2>
        <button className="btn-export" onClick={handleExportCSV} disabled={players.length === 0}>
          CSV Export
        </button>
      </div>

      <div className="stats-content">
        {players.length === 0 ? (
          <p className="no-stats">Noch keine Spieler- oder Spieldaten vorhanden.</p>
        ) : (
          <div className="player-stats-list">
            {players.map(player => (
              <div key={player.id} className="player-stat-card">
                <h3>{player.name}</h3>
                <div className="stat-grid">
                  <div className="stat-item">
                    <span className="stat-label">Average (PPD)</span>
                    <span className="stat-value">{player.lifetime.average.toFixed(1)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Spiele (G / W)</span>
                    <span className="stat-value">{player.lifetime.gamesPlayed} / {player.lifetime.gamesWon}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">High Checkout</span>
                    <span className="stat-value">{player.lifetime.highestCheckout}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Gesamtpunkte</span>
                    <span className="stat-value">{player.lifetime.totalPoints}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
