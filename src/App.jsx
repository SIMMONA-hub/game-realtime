import React, { useState, useEffect, useCallback } from 'react';

// Components
import GameField from './components/GameField.jsx';
import PlayerList from './components/PlayerList.jsx';
import LoginForm from './components/LoginForm.jsx';

// Hooks
import usePlayerMovement from './hooks/usePlayerMovement.js';
import useSupabaseRealtimePlayers from './hooks/useSupabaseRealtimePlayers.js';

// Services
import supabase from './services/supabase.js';
import SupabaseService from './services/SupabaseService.js';

// Utils
import { generatePlayerId, generateRandomColor } from './utils/helpers.js';
import { GAME_CONFIG } from './config/gameConfig.js';

const App = () => {
  const [gameState, setGameState] = useState('login');
  const [playerId, setPlayerId] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  // Получение других игроков
  const otherPlayers = useSupabaseRealtimePlayers(playerId, supabase);

  // Обработка движения игрока - ИСПРАВЛЕНО: убираем currentPlayer из зависимостей
  const handlePositionChange = useCallback(async (x, y) => {
    if (playerId) {
      try {
        await SupabaseService.updatePlayerPosition(playerId, x, y, supabase);
        // НЕ обновляем currentPlayer здесь - это создавало цикл!
      } catch (error) {
        console.error('Failed to update position:', error);
      }
    }
  }, [playerId]); // Убрали currentPlayer из зависимостей!

  // Позиция игрока с управлением
  const playerPosition = usePlayerMovement(
    playerId,
    currentPlayer?.x || 0,
    currentPlayer?.y || 0,
    handlePositionChange
  );

  // ИСПРАВЛЕНО: обновляем позицию только локально для отображения
  useEffect(() => {
    if (currentPlayer && (playerPosition.x !== currentPlayer.x || playerPosition.y !== currentPlayer.y)) {
      setCurrentPlayer(prev => ({
        ...prev,
        x: playerPosition.x,
        y: playerPosition.y
      }));
    }
  }, [playerPosition.x, playerPosition.y]); // Точные зависимости вместо всего объекта

  // Присоединение к игре
  const handleJoinGame = useCallback(async (playerName) => {
    try {
      setConnectionStatus('connecting');
      
      const newPlayerId = generatePlayerId();
      const newPlayer = {
        id: newPlayerId,
        name: playerName,
        x: Math.floor(Math.random() * (GAME_CONFIG.FIELD_WIDTH - GAME_CONFIG.PLAYER_SIZE)),
        y: Math.floor(Math.random() * (GAME_CONFIG.FIELD_HEIGHT - GAME_CONFIG.PLAYER_SIZE)),
        color: generateRandomColor(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const result = await SupabaseService.addPlayer(newPlayer, supabase);
      
      if (result.error) {
        console.error('Failed to add player:', result.error);
        setConnectionStatus('error');
        return;
      }

      setPlayerId(newPlayerId);
      setCurrentPlayer(newPlayer);
      setGameState('playing');
      setConnectionStatus('connected');
      
    } catch (error) {
      console.error('Failed to join game:', error);
      setConnectionStatus('error');
    }
  }, []);

  // Обработка выхода из игры
  useEffect(() => {
    if (!playerId) return;

    const handleBeforeUnload = () => {
      // Синхронное удаление для beforeunload
      navigator.sendBeacon(`https://irpwgcpqxcasoxfhmuph.supabase.co/rest/v1/players?id=eq.${playerId}`, 
        JSON.stringify({}));
    };

    const handleVisibilityChange = async () => {
      if (document.hidden) {
        await SupabaseService.removePlayer(playerId, supabase);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      // Удаление при размонтировании
      SupabaseService.removePlayer(playerId, supabase);
    };
  }, [playerId]); // Только playerId в зависимостях

  if (gameState === 'login') {
    return <LoginForm onJoin={handleJoinGame} />;
  }

  return (
    <div style={{
      backgroundColor: '#1a1a1a',
      minHeight: '100vh',
      padding: '20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      gap: '20px'
    }}>
      <div>
        <div style={{
          marginBottom: '15px',
          color: '#4ECDC4',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          🎮 Управление: W/A/S/D для движения
        </div>
        <GameField
          currentPlayer={currentPlayer}
          otherPlayers={otherPlayers}
        />
      </div>
      <PlayerList
        currentPlayer={currentPlayer}
        otherPlayers={otherPlayers}
        connectionStatus={connectionStatus}
      />
    </div>
  );
};

export default App;