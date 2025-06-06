import React, { useRef, useEffect } from 'react';
import { GAME_CONFIG } from '../config/gameConfig.js';

// Компонент игрового поля
const GameField = ({ currentPlayer, otherPlayers }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');

    // Очистка canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, GAME_CONFIG.FIELD_WIDTH, GAME_CONFIG.FIELD_HEIGHT);

    // Рисование текущего игрока
    if (currentPlayer) {
      ctx.fillStyle = currentPlayer.color;
      ctx.fillRect(
        currentPlayer.x, 
        currentPlayer.y, 
        GAME_CONFIG.PLAYER_SIZE, 
        GAME_CONFIG.PLAYER_SIZE
      );
      
      // Подпись с именем игрока
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.fillText(currentPlayer.name, currentPlayer.x, currentPlayer.y - 8);
    }

    // Рисование других игроков
    otherPlayers.forEach((player) => {
      ctx.fillStyle = player.color;
      ctx.fillRect(
        player.x, 
        player.y, 
        GAME_CONFIG.PLAYER_SIZE, 
        GAME_CONFIG.PLAYER_SIZE
      );
      
      // Подпись с именем игрока
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.fillText(player.name, player.x, player.y - 8);
    });

    // Рисование границ поля
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, GAME_CONFIG.FIELD_WIDTH, GAME_CONFIG.FIELD_HEIGHT);
  }, [currentPlayer, otherPlayers]);

  return (
    <canvas
      ref={canvasRef}
      width={GAME_CONFIG.FIELD_WIDTH}
      height={GAME_CONFIG.FIELD_HEIGHT}
      style={{
        border: '2px solid #333',
        backgroundColor: '#1a1a1a',
        display: 'block'
      }}
    />
  );
};

export default GameField;