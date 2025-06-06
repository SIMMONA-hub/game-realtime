 // Генерация случайного цвета
export const generateRandomColor = () => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
      '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  // Генерация уникального ID игрока
  export const generatePlayerId = () => {
    return 'player_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  };