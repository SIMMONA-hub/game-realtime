import React from 'react';

// Компонент списка игроков
const PlayerList = ({ currentPlayer, otherPlayers, connectionStatus }) => {
  const totalPlayers = otherPlayers.size + (currentPlayer ? 1 : 0);

  return (
    <div style={{
      marginLeft: '20px',
      padding: '15px',
      backgroundColor: '#2a2a2a',
      borderRadius: '8px',
      color: '#fff',
      minWidth: '200px',
      height: 'fit-content'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#4ECDC4' }}>
        🎮 Игроки онлайн ({totalPlayers})
      </h3>
      
      <div style={{
        fontSize: '12px',
        color: connectionStatus === 'connected' ? '#96CEB4' : '#FF6B6B',
        marginBottom: '15px'
      }}>
        Статус: {connectionStatus === 'connected' ? '🟢 Подключено' : '🟡 Подключение...'}
      </div>
      
      {currentPlayer && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '8px',
          padding: '5px',
          backgroundColor: '#333',
          borderRadius: '4px'
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            backgroundColor: currentPlayer.color,
            marginRight: '8px',
            border: '1px solid #fff'
          }} />
          <span style={{ fontWeight: 'bold' }}>{currentPlayer.name} (вы)</span>
        </div>
      )}

      {Array.from(otherPlayers.entries()).map(([playerId, player]) => (
        <div key={playerId} style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '8px',
          padding: '5px',
          backgroundColor: '#333',
          borderRadius: '4px'
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            backgroundColor: player.color,
            marginRight: '8px',
            border: '1px solid #fff'
          }} />
          <span>{player.name}</span>
        </div>
      ))}
      
      {otherPlayers.size === 0 && (
        <div style={{
          textAlign: 'center',
          color: '#666',
          fontSize: '14px',
          fontStyle: 'italic',
          marginTop: '20px'
        }}>
          Ожидание других игроков...
        </div>
      )}
    </div>
  );
};

export default PlayerList;