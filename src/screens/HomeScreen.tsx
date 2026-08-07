import React from 'react';
import './HomeScreen.css'; // <-- Dieser Import ist entscheidend!

export const HomeScreen: React.FC<any> = (props) => {
  return (
    <div className="home-screen">
      <div className="home-header">
        <div style={{ fontSize: '40px', marginBottom: '8px' }}>🎯</div>
        <h1 className="home-title">Dart Counter</h1>
        <p className="home-subtitle">Professional PWA Experience</p>
      </div>

      <div className="home-menu">
        {/* Achte darauf, dass dein onClick-Handler hier korrekt heißt, z.B. props.onNewGame oder props.onStartGame */}
        <button className="btn-menu-primary" onClick={props.onNewGame || props.onStartGame}>
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
    </div>
  );
};
