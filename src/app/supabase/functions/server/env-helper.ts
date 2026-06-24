/**
 * 🔧 ENV HELPER - Adaptador para variáveis de ambiente do Supabase
 * 
 * O Supabase não aceita underscores (_) em nomes de secrets nas Edge Functions.
 * Esta função tenta buscar variáveis com underscore E com espaços (fallback).
 * 
 * Exemplo:
 * - Procura: APOLLO_API_KEY
 * - Se não encontrar, tenta: APOLLO API KEY
 */

export function getEnv(key: string): string | undefined {
  // Primeiro tenta com underscore (padrão do código)
  let value = Deno.env.get(key);
  
  // Se não encontrar, tenta com espaços (limitação do Supabase)
  if (!value) {
    const keyWithSpaces = key.replace(/_/g, ' ');
    value = Deno.env.get(keyWithSpaces);
    
    if (value) {
      console.log(`⚠️  [ENV] "${key}" não encontrada, usando "${keyWithSpaces}"`);
    }
  }
  
  return value;
}

// Wrapper para garantir que a variável existe (com valor padrão)
export function getEnvOrDefault(key: string, defaultValue: string = ''): string {
  return getEnv(key) || defaultValue;
}
