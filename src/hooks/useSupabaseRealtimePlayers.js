import { useState, useEffect, useRef } from 'react';

// Хук для работы с Supabase Realtime
export const useSupabaseRealtimePlayers = (currentPlayerId, supabase) => {
  const [players, setPlayers] = useState(new Map());
  const channelRef = useRef(null);

  useEffect(() => {
    // Загрузка существующих игроков при подключении
    const loadExistingPlayers = async () => {
      try {
        const { data, error } = await supabase
          .from('players')
          .select('*');
        
        if (error) {
          console.error('Error loading players:', error);
          return;
        }

        const playersMap = new Map();
        data?.forEach(player => {
          if (player.id !== currentPlayerId) {
            playersMap.set(player.id, player);
          }
        });
        setPlayers(playersMap);
      } catch (error) {
        console.error('Failed to load existing players:', error);
      }
    };

    if (currentPlayerId && supabase) {
      loadExistingPlayers();

      // Создание канала для подписки на изменения в реальном времени
      const channel = supabase
        .channel('players-channel')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'players'
          },
          (payload) => {
            const newPlayer = payload.new;
            if (newPlayer.id !== currentPlayerId) {
              setPlayers(prev => new Map(prev.set(newPlayer.id, newPlayer)));
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'players'
          },
          (payload) => {
            const updatedPlayer = payload.new;
            if (updatedPlayer.id !== currentPlayerId) {
              setPlayers(prev => new Map(prev.set(updatedPlayer.id, updatedPlayer)));
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'players'
          },
          (payload) => {
            const deletedPlayer = payload.old;
            setPlayers(prev => {
              const newPlayers = new Map(prev);
              newPlayers.delete(deletedPlayer.id);
              return newPlayers;
            });
          }
        )
        .subscribe();

      channelRef.current = channel;

      return () => {
        if (channelRef.current) {
          supabase.removeChannel(channelRef.current);
        }
      };
    }
  }, [currentPlayerId, supabase]);

  return players;
};

export default useSupabaseRealtimePlayers;