// ═══════════════════════════════════════════════════════════════════════
// 🔐 SUPABASE CLIENT - ImobHunter
// ═══════════════════════════════════════════════════════════════════════

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { supabaseUrl, publicAnonKey } from './info';

let supabaseClient: ReturnType<typeof createSupabaseClient> | null = null;

// 🔒 Adaptador de Storage para Sessão Volátil (Bancária)
// - Persiste durante o refresh (F5)
// - Morre ao fechar a aba/navegador
const sessionStorageAdapter = {
  getItem: (key: string) => {
    if (typeof sessionStorage === 'undefined') return null;
    return sessionStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    if (typeof sessionStorage === 'undefined') return;
    sessionStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    if (typeof sessionStorage === 'undefined') return;
    sessionStorage.removeItem(key);
  },
};

export function createClient() {
  if (!supabaseClient) {
    supabaseClient = createSupabaseClient(supabaseUrl, publicAnonKey, {
      auth: {
        persistSession: true, // Mantém a sessão ativa...
        storage: sessionStorageAdapter, // ...mas APENAS enquanto a aba estiver aberta.
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  }
  return supabaseClient;
}

export function getSupabase() {
  if (!supabaseClient) {
    return createClient();
  }
  return supabaseClient;
}
