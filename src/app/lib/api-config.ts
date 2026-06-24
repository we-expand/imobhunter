/**
 * 🎯 Configuração Centralizada da API ImobHunter
 * 
 * ROTAS DISPONÍVEIS:
 * - GET  /imobhunter-api/ping
 * - GET  /imobhunter-api/diagnostics
 * - POST /imobhunter-api/leads/search
 * - GET  /imobhunter-api/leads/history
 * - GET  /imobhunter-api/leads/search/:searchId
 */

import { projectId, publicAnonKey, serverUrl } from '../utils/supabase/info';

export const API_BASE_URL = `${serverUrl}/imobhunter-api`;

export const API_ROUTES = {
  // Health & Diagnostics
  ping: '/ping',
  diagnostics: '/diagnostics',
  
  // Leads
  searchLeads: '/leads/search',
  leadsHistory: '/leads/history',
  getSearch: (searchId: string) => `/leads/search/${searchId}`,
} as const;

/**
 * Helper para fazer chamadas autenticadas à API
 */
export async function apiCall<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Authorization': `Bearer ${publicAnonKey}`,
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `API Error: ${response.status}`);
  }

  return response.json();
}

/**
 * Verificar se a API está online
 */
export async function checkAPIHealth(): Promise<boolean> {
  try {
    const response = await apiCall(API_ROUTES.ping);
    return response.status === 'alive';
  } catch (error) {
    console.error('❌ API Health Check falhou:', error);
    return false;
  }
}
