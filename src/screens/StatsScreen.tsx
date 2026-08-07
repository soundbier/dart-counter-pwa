return (
  <div className="screen-wrapper">
    <div className="screen-header">
      {/* Achte auf den korrekten Namen deines onClick Handlers */}
      <button className="btn-back" onClick={onBack}>← Zurück</button>
      <h2 className="screen-title">Statistiken</h2>
      <button className="btn-action">CSV Export</button>
    </div>

    <div className="stats-content">
      {/* Hier läuft deine Map-Funktion über die Spieler */}
      {players.map(player => (
        <div key={player.id} className="stat-card">
          <div className="stat-card-header">{player.name}</div>
          
          <div className="stat-grid">
            <div className="stat-box">
              <span className="stat-label">Average (PPD)</span>
              <span className="stat-value">{player.ppd || '0.0'}</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Spiele (G / W)</span>
              <span className="stat-value">{player.games} / {player.wins}</span>
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
