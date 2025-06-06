import React, { useState } from 'react';

// Компонент формы входа
const LoginForm = ({ onJoin }) => {
  const [playerName, setPlayerName] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (playerName.trim() && !isConnecting) {
      setIsConnecting(true);
      await onJoin(playerName.trim());
      setIsConnecting(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#1a1a1a',
      color: '#fff'
    }}>
      <div style={{
        backgroundColor: '#2a2a2a',
        padding: '30px',
        borderRadius: '10px',
        textAlign: 'center',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
      }}>
        <h1 style={{ color: '#4ECDC4', marginBottom: '10px' }}>
          🎮 Многопользовательская 2D игра
        </h1>
        <p style={{ marginBottom: '5px', color: '#ccc', fontSize: '14px' }}>
          Powered by Supabase Realtime
        </p>
        <p style={{ marginBottom: '20px', color: '#ccc' }}>
          Управление: W/A/S/D для движения
        </p>
        <div>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Введите ваше имя"
            style={{
              padding: '10px',
              marginBottom: '15px',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              width: '200px',
              textAlign: 'center',
              opacity: isConnecting ? 0.6 : 1
            }}
            maxLength={20}
            autoFocus
            disabled={isConnecting}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSubmit(e);
              }
            }}
          />
          <br />
          <button
            onClick={handleSubmit}
            disabled={isConnecting}
            style={{
              padding: '10px 20px',
              backgroundColor: isConnecting ? '#666' : '#4ECDC4',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: isConnecting ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s',
              opacity: isConnecting ? 0.6 : 1
            }}
            onMouseOver={(e) => {
              if (!isConnecting) {
                e.target.style.backgroundColor = '#45B7D1';
              }
            }}
            onMouseOut={(e) => {
              if (!isConnecting) {
                e.target.style.backgroundColor = '#4ECDC4';
              }
            }}
          >
            {isConnecting ? 'Подключение...' : 'Присоединиться к игре'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;