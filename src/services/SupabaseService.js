 // Сервис для работы с Supabase
export const SupabaseService = {
    // Добавление нового игрока
    async addPlayer(player, supabase) {
      try {
        const { data, error } = await supabase
          .from('players')
          .insert([player])
          .select();
        
        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error adding player:', error);
        return { data: null, error };
      }
    },
  
    // Обновление позиции игрока
    async updatePlayerPosition(playerId, x, y, supabase) {
      try {
        const { data, error } = await supabase
          .from('players')
          .update({ 
            x, 
            y, 
            updated_at: new Date().toISOString() 
          })
          .eq('id', playerId)
          .select();
        
        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error updating player position:', error);
        return { data: null, error };
      }
    },
  
    // Удаление игрока
    async removePlayer(playerId, supabase) {
      try {
        const { error } = await supabase
          .from('players')
          .delete()
          .eq('id', playerId);
        
        if (error) throw error;
        return { error: null };
      } catch (error) {
        console.error('Error removing player:', error);
        return { error };
      }
    }
  };
  
  export default SupabaseService;