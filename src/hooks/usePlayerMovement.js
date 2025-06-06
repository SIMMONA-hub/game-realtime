import { useState, useEffect, useRef, useCallback } from 'react';
import { GAME_CONFIG } from '../config/gameConfig.js';

export const usePlayerMovement = (playerId, initialX, initialY, onPositionChange) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const keysPressed = useRef(new Set());
  const lastUpdateTime = useRef(0);

  // ИСПРАВЛЕНО: мемоизируем функцию обновления
  const updatePosition = useCallback(() => {
    if (keysPressed.current.size === 0) return;

    const now = Date.now();
    if (now - lastUpdateTime.current < 50) return; // Ограничиваем частоту обновлений

    setPosition(prev => {
      let newX = prev.x;
      let newY = prev.y;

      if (keysPressed.current.has('KeyW')) newY -= GAME_CONFIG.MOVE_SPEED;
      if (keysPressed.current.has('KeyS')) newY += GAME_CONFIG.MOVE_SPEED;
      if (keysPressed.current.has('KeyA')) newX -= GAME_CONFIG.MOVE_SPEED;
      if (keysPressed.current.has('KeyD')) newX += GAME_CONFIG.MOVE_SPEED;

      newX = Math.max(0, Math.min(GAME_CONFIG.FIELD_WIDTH - GAME_CONFIG.PLAYER_SIZE, newX));
      newY = Math.max(0, Math.min(GAME_CONFIG.FIELD_HEIGHT - GAME_CONFIG.PLAYER_SIZE, newY));

      if (newX !== prev.x || newY !== prev.y) {
        lastUpdateTime.current = now;
        onPositionChange(newX, newY);
        return { x: newX, y: newY };
      }
      return prev;
    });
  }, [onPositionChange]);

  // ИСПРАВЛЕНО: обновляем позицию при изменении начальных координат
  useEffect(() => {
    setPosition({ x: initialX, y: initialY });
  }, [initialX, initialY]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        keysPressed.current.add(e.code);
      }
    };

    const handleKeyUp = (e) => {
      if (['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        keysPressed.current.delete(e.code);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const moveInterval = setInterval(updatePosition, 16);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(moveInterval);
    };
  }, [updatePosition]);

  return position;
};

export default usePlayerMovement;