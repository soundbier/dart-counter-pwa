import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { Player } from '../types';
import './PlayerModal.css';

interface PlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartGame: (selectedPlayerIds: string[]) => void;
}

export const PlayerModal: React.FC<PlayerModalProps> = ({ isOpen, onClose, onStartGame }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');

  // Lädt die Spieler und selektiert standardmäßig alle (oder setzt es zurück)
  useEffect(() => {
    if (isOpen) {
      const initModal = async () => {
        const allPlayers = await db.players.toArray();
        setPlayers(allPlayers);
        // Optional: Wenn keine Spieler ausgewählt sind, direkt alle vorselektieren 
        // oder den Array leer lassen. Hier behalten wir deine Logik, setzen sie aber stabil auf.
      };
      initModal();
    } else {
      // Wenn das Modal schließt, leeren wir die temporären Eingaben, 
      // damit beim nächsten Öffnen kein alter State dazwischenfunkt
      setNewPlayerName('');
    }
  }, [isOpen]);

  const handleTogglePlayer = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;

    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name: newPlayerName.trim(),
      avatar: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      lifetime: {
        gamesPlayed: 0,
        gamesWon: 0,
        totalThrows: 0,
        totalPoints: 0,
        average: 0,
        highestCheckout: 0,
      }
    };

    await db.players.add(newPlayer);
    setNewPlayerName('');
    
    // Spieler neu laden und den neuen direkt zur Auswahl hinzufügen
    const updatedPlayers = await db.players.toArray();
    setPlayers(updatedPlayers);
    setSelectedIds(prev => [...prev, newPlayer.id]);
  };

  const handleStart = () => {
    if (selectedIds.length === 0) return;
    onStartGame(selectedIds);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Wer spielt?</h2>
        
        <form onSubmit={handleAddPlayer} className="add-player-form">
          <input
            type="text"
            placeholder="Neuen Spieler eingeben..."
            value={newPlayerName}
            onChange={e => setNewPlayerName(e.target.value)}
          />
          <button type="submit" className="btn-add">+</button>
        </form>

        <div className="player-list">
          {players.length === 0 ? (
            <p className="no-players">Noch keine Spieler angelegt. Füge oben welche hinzu!</p>
          ) : (
            players.map(player => {
              const isSelected = selectedIds.includes(player.id);
              return (
                <div
                  key={player.id}
                  className={`player-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleTogglePlayer(player.id)}
                >
                  <span>{player.name}</span>
                  <span className="checkbox">{isSelected ? '✓' : ''}</span>
                </div>
              );
            })
          )}
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Abbrechen</button>
          <button
            className="btn-primary"
            disabled={selectedIds.length === 0}
            onClick={handleStart}
          >
            Spiel starten ({selectedIds.length})
          </button>
        </div>
      </div>
    </div>
  );
};
