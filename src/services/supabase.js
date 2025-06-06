import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from '../config/gameConfig.js';

// Создание клиента Supabase
export const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

// Экспорт для использования в других файлах
export default supabase;