import React, { useState } from 'react';
import { HomeScreen } from './screens/HomeScreen';
import { GameScreen } from './screens/GameScreen';
import { StatsScreen } from './screens/StatsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { PlayerModal } from './components/PlayerModal';
import { GameMode } from './types';

type Screen = 'home' | 'game' | 'stats' | 'settings';

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState<boolean>(false);
  const [activePlayerIds, setActivePlayerIds] = useState<string[]>([]);
  // Für das MVP standardmäßig 501 Double Out
  const [gameMode] = useState<GameMode>('501-double');

  const handleOpenPlayerModal = () => {
    setIsPlayerModalOpen(true);
  };

  const handleStartGame = (playerIds: string[]) => {
    setActivePlayerIds(playerIds);
    setIsPlayerModalOpen(false);
    setCurrentScreen('game');
  };

  return (
    <>
      {currentScreen === 'home' && (
        <HomeScreen
          onStartNewGame={handleOpenPlayerModal}
          onOpenStats={() => setCurrentScreen('stats')}
          onOpenSettings={() => setCurrentScreen('settings')}
        />
      )}

      {currentScreen === 'game' && (
        <GameScreen
          playerIds={activePlayerIds}
          mode={gameMode}
          onGameOver={() => setCurrentScreen('home')}
          onBackToHome={() => setCurrentScreen('home')}
        />
      )}

      {currentScreen === 'stats' && (
        <StatsScreen onBackToHome={() => setCurrentScreen('home')} />
      )}

      {currentScreen === 'settings' && (
        <SettingsScreen onBackToHome={() => setCurrentScreen('home')} />
      )}

      <PlayerModal
        isOpen={isPlayerModalOpen}
        onClose={() => setIsPlayerModalOpen(false)}
        onStartGame={handleStartGame}
      />
    </>
  );
};

export default App;
