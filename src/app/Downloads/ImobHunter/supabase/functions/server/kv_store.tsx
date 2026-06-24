// ═══════════════════════════════════════════════════════════════════════
// 🗄️ KV STORE - Sistema de Banco de Dados Chave-Valor para ImobHunter
// ═══════════════════════════════════════════════════════════════════════
// Este arquivo fornece funções para interagir com o banco de dados KV.
// NÃO MODIFIQUE este arquivo - ele é gerenciado pelo sistema.
// ═══════════════════════════════════════════════════════════════════════

import { createClient } from '&';

// Criar cliente Supabase
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const TABLE_NAME = 'kv_store_9e4b8b7c';

/**
 * Get a single value by key
 */
export async function get(key: string): Promise<any> {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('value')
      .eq('key', key)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw error;
    }

    return data?.value;
  } catch (error) {
    console.error(`❌ Erro ao buscar chave "${key}":`, error);
    return null;
  }
}

/**
 * Set a single key-value pair
 */
export async function set(key: string, value: any): Promise<void> {
  try {
    const { error } = await supabase
      .from(TABLE_NAME)
      .upsert({ key, value }, { onConflict: 'key' });

    if (error) throw error;
  } catch (error) {
    console.error(`❌ Erro ao definir chave "${key}":`, error);
    throw error;
  }
}

/**
 * Delete a single key
 */
export async function del(key: string): Promise<void> {
  try {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('key', key);

    if (error) throw error;
  } catch (error) {
    console.error(`❌ Erro ao deletar chave "${key}":`, error);
    throw error;
  }
}

/**
 * Get multiple values by keys
 */
export async function mget(keys: string[]): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('value')
      .in('key', keys);

    if (error) throw error;

    return data?.map(item => item.value) || [];
  } catch (error) {
    console.error('❌ Erro ao buscar múltiplas chaves:', error);
    return [];
  }
}

/**
 * Set multiple key-value pairs
 */
export async function mset(entries: Array<[string, any]>): Promise<void> {
  try {
    const records = entries.map(([key, value]) => ({ key, value }));
    const { error } = await supabase
      .from(TABLE_NAME)
      .upsert(records, { onConflict: 'key' });

    if (error) throw error;
  } catch (error) {
    console.error('❌ Erro ao definir múltiplas chaves:', error);
    throw error;
  }
}

/**
 * Delete multiple keys
 */
export async function mdel(keys: string[]): Promise<void> {
  try {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .in('key', keys);

    if (error) throw error;
  } catch (error) {
    console.error('❌ Erro ao deletar múltiplas chaves:', error);
    throw error;
  }
}

/**
 * Get all values with keys starting with a prefix
 */
export async function getByPrefix(prefix: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('value')
      .like('key', `${prefix}%`);

    if (error) throw error;

    return data?.map(item => item.value) || [];
  } catch (error) {
    console.error(`❌ Erro ao buscar chaves com prefixo "${prefix}":`, error);
    return [];
  }
}

console.log('✅ KV Store initialized');
