// Configuração de API para diferentes ambientes
// HostGator: Frontend servido de www.tapago.pt
// Render: Servidor WhatsApp em api.tapago.pt

const WHATSAPP_SERVER_URL = import.meta.env.VITE_WHATSAPP_SERVER_URL || 'https://api.tapago.pt';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';

export const API_CONFIG = {
  // Servidor WhatsApp (WPPConnect no Render via api.tapago.pt)
  whatsapp: WHATSAPP_SERVER_URL,
  
  // Supabase (banco de dados e edge functions)
  supabase: SUPABASE_URL,
  
  // Edge functions do Supabase
  edgeFunctions: `${SUPABASE_URL}/functions/v1/make-server-d96fb0db`,
};

// Helper para fazer requisições ao servidor WhatsApp
export async function callWhatsAppAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_CONFIG.whatsapp}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`WhatsApp API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}
