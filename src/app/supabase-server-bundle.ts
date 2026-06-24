// ==========================================
// 📦 IMOBHUNTER SERVER - BUNDLE COMPLETO
// ==========================================
// Este arquivo consolida TODOS os módulos do servidor em um único arquivo
// para facilitar o deploy via Editor do Supabase
// Criado em: Dezembro 2024

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

console.log('🚀 ImobHunter Server - Bundle Consolidado - Iniciando...');

import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from '&';

// ==========================================
// 🔑 ENV HELPER (inline)
// ==========================================
function getEnv(key: string): string | undefined {
  let value = Deno.env.get(key);
  
  if (!value) {
    const keyWithSpaces = key.replace(/_/g, ' ');
    value = Deno.env.get(keyWithSpaces);
    
    if (value) {
      console.log(`⚠️ [ENV] "${key}" não encontrada, usando "${keyWithSpaces}"`);
    }
  }
  
  return value;
}

function getEnvOrDefault(key: string, defaultValue: string = ''): string {
  return getEnv(key) || defaultValue;
}

// ==========================================
// 🗄️ KV STORE (inline)
// ==========================================
const kvClient = () => createClient(
  getEnv("SUPABASE_URL") || '',
  getEnv("SUPABASE_SERVICE_ROLE_KEY") || '',
);

const kvSet = async (key: string, value: any): Promise<void> => {
  const supabase = kvClient();
  const { error } = await supabase.from("kv_store_9e4b8b7c").upsert({ key, value });
  if (error) throw new Error(error.message);
};

const kvGet = async (key: string): Promise<any> => {
  const supabase = kvClient();
  const { data, error } = await supabase.from("kv_store_9e4b8b7c").select("value").eq("key", key).maybeSingle();
  if (error) throw new Error(error.message);
  return data?.value;
};

const kvDel = async (key: string): Promise<void> => {
  const supabase = kvClient();
  const { error } = await supabase.from("kv_store_9e4b8b7c").delete().eq("key", key);
  if (error) throw new Error(error.message);
};

const kvMget = async (keys: string[]): Promise<any[]> => {
  const supabase = kvClient();
  const { data, error } = await supabase.from("kv_store_9e4b8b7c").select("value").in("key", keys);
  if (error) throw new Error(error.message);
  return data?.map(d => d.value) || [];
};

const kvGetByPrefix = async (prefix: string): Promise<any[]> => {
  const supabase = kvClient();
  const { data, error } = await supabase.from("kv_store_9e4b8b7c").select("*").like("key", `${prefix}%`);
  if (error) throw new Error(error.message);
  return data || [];
};

// ==========================================
// 🔍 DIAGNÓSTICO DE API KEYS (Boot)
// ==========================================
console.log('🔍 ═══════════════════════════════════════════════════════');
console.log('🔍 DIAGNÓSTICO DE VARIÁVEIS DE AMBIENTE (API KEYS)');
console.log('🔍 ═══════════════════════════════════════════════════════');

const apiKeys = {
  'APOLLO_API_KEY': getEnv('APOLLO_API_KEY'),
  'HUNTER_API_KEY': getEnv('HUNTER_API_KEY'),
  'PDL_API_KEY': getEnv('PDL_API_KEY'),
  'ROCKETREACH_API_KEY': getEnv('ROCKETREACH_API_KEY'),
  'RAPIDAPI_KEY': getEnv('RAPIDAPI_KEY'),
  'LUSHA_API_KEY': getEnv('LUSHA_API_KEY'),
  'PROXYCURL_API_KEY': getEnv('PROXYCURL_API_KEY'),
  'RESEND_API_KEY': getEnv('RESEND_API_KEY'),
  'SUPABASE_URL': getEnv('SUPABASE_URL'),
  'SUPABASE_ANON_KEY': getEnv('SUPABASE_ANON_KEY'),
  'SUPABASE_SERVICE_ROLE_KEY': getEnv('SUPABASE_SERVICE_ROLE_KEY')
};

Object.entries(apiKeys).forEach(([key, value]) => {
  if (value) {
    const preview = value.length > 10 ? `${value.substring(0, 10)}...` : value.substring(0, 10);
    console.log(`   ✅ ${key}: ${preview} (${value.length} chars)`);
  } else {
    console.log(`   ❌ ${key}: NÃO CONFIGURADA`);
  }
});

console.log('🔍 ═══════════════════════════════════════════════════════');
console.log('');

// ==========================================
// 🌐 CRIAR SERVIDOR HONO
// ==========================================
const app = new Hono();

// Middlewares
app.use('*', logger(console.log));
app.use('/*', cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
}));

// ==========================================
// 📍 ROTAS BÁSICAS
// ==========================================

// Health check
app.get("/make-server-9e4b8b7c/health", (c) => {
  return c.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    version: "bundle-1.0.0"
  });
});

// Ping (teste simples)
app.get("/make-server-9e4b8b7c/ping", (c) => {
  return c.json({ 
    status: "alive",
    timestamp: new Date().toISOString(),
    message: "✅ ImobHunter Server (Bundle) está funcionando!",
    version: "bundle-1.0.0"
  });
});

// Debug de env vars
app.get("/make-server-9e4b8b7c/debug/env-vars", (c) => {
  const apolloKey = getEnv('APOLLO_API_KEY');
  const supabaseUrl = getEnv('SUPABASE_URL');
  const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY');
  const supabaseServiceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');
  
  return c.json({
    timestamp: new Date().toISOString(),
    configured: {
      APOLLO_API_KEY: !!apolloKey,
      SUPABASE_URL: !!supabaseUrl,
      SUPABASE_ANON_KEY: !!supabaseAnonKey,
      SUPABASE_SERVICE_ROLE_KEY: !!supabaseServiceKey
    },
    previews: {
      APOLLO_API_KEY: apolloKey ? apolloKey.substring(0, 10) + '...' : 'N/A',
      SUPABASE_URL: supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'N/A',
      SUPABASE_ANON_KEY: supabaseAnonKey ? supabaseAnonKey.substring(0, 10) + '...' : 'N/A',
      SUPABASE_SERVICE_ROLE_KEY: supabaseServiceKey ? supabaseServiceKey.substring(0, 10) + '...' : 'N/A'
    },
    lengths: {
      APOLLO_API_KEY: apolloKey?.length || 0,
      SUPABASE_URL: supabaseUrl?.length || 0,
      SUPABASE_ANON_KEY: supabaseAnonKey?.length || 0,
      SUPABASE_SERVICE_ROLE_KEY: supabaseServiceKey?.length || 0
    },
    message: '✅ Servidor Bundle configurado e funcionando!'
  });
});

// ==========================================
// 🧪 ROTA: Teste de APIs
// ==========================================
app.get("/make-server-9e4b8b7c/search/test-apis", async (c) => {
  const apolloKey = getEnv('APOLLO_API_KEY');
  const hunterKey = getEnv('HUNTER_API_KEY');
  const pdlKey = getEnv('PDL_API_KEY');
  
  const status: any = {
    apollo: {
      configured: !!apolloKey,
      keyLength: apolloKey?.length || 0,
      preview: apolloKey ? apolloKey.substring(0, 10) + '...' : 'N/A',
      valid: false,
      error: null
    },
    hunter: {
      configured: !!hunterKey,
      keyLength: hunterKey?.length || 0,
      preview: hunterKey ? hunterKey.substring(0, 10) + '...' : 'N/A',
      valid: false,
      error: null
    },
    pdl: {
      configured: !!pdlKey,
      keyLength: pdlKey?.length || 0,
      preview: pdlKey ? pdlKey.substring(0, 10) + '...' : 'N/A',
      valid: false,
      error: null
    }
  };

  // Testar Apollo.io
  if (apolloKey) {
    try {
      console.log('🧪 Testando Apollo.io...');
      
      const testResponse = await fetch('https://api.apollo.io/v1/mixed_people/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({
          api_key: apolloKey.trim(),
          person_titles: ['CEO'],
          per_page: 1
        })
      });

      const responseText = await testResponse.text();
      
      if (testResponse.ok) {
        status.apollo.valid = true;
        console.log('   ✅ Apollo: API key válida!');
      } else {
        status.apollo.error = `Status ${testResponse.status}: ${responseText}`;
        console.log('   ❌ Apollo: API key inválida');
      }
    } catch (error: any) {
      status.apollo.error = error.message;
      console.log('   ❌ Apollo: Erro ao testar -', error.message);
    }
  }

  // Testar Hunter.io
  if (hunterKey) {
    try {
      console.log('🧪 Testando Hunter.io...');
      
      const testResponse = await fetch(
        `https://api.hunter.io/v2/domain-search?domain=example.com&api_key=${hunterKey.trim()}&limit=1`
      );

      if (testResponse.ok) {
        status.hunter.valid = true;
        console.log('   ✅ Hunter: API key válida!');
      } else {
        const responseText = await testResponse.text();
        status.hunter.error = `Status ${testResponse.status}: ${responseText}`;
        console.log('   ❌ Hunter: API key inválida');
      }
    } catch (error: any) {
      status.hunter.error = error.message;
      console.log('   ❌ Hunter: Erro ao testar -', error.message);
    }
  }

  return c.json({
    success: true,
    apis: status,
    summary: {
      configured: [status.apollo, status.hunter, status.pdl].filter(s => s.configured).length,
      valid: [status.apollo, status.hunter, status.pdl].filter(s => s.valid).length
    }
  });
});

// ==========================================
// 🔍 ROTA: Busca de Leads (Apollo.io)
// ==========================================
app.post("/make-server-9e4b8b7c/search/leads", async (c) => {
  try {
    const body = await c.req.json();
    const { query, location, jobTitles, page = 1, perPage = 10 } = body;

    const apolloKey = getEnv('APOLLO_API_KEY');

    if (!apolloKey) {
      return c.json({
        success: false,
        error: 'APOLLO_API_KEY não configurada',
        message: 'Configure a variável de ambiente APOLLO API KEY no Supabase'
      }, 500);
    }

    console.log('🔍 Buscando leads no Apollo.io...');
    console.log('   Query:', query);
    console.log('   Location:', location);
    console.log('   Job Titles:', jobTitles);

    const searchPayload: any = {
      api_key: apolloKey.trim(),
      page: page,
      per_page: perPage
    };

    // Adicionar filtros
    if (jobTitles && jobTitles.length > 0) {
      searchPayload.person_titles = jobTitles;
    }

    if (location) {
      searchPayload.person_locations = [location];
    }

    if (query) {
      searchPayload.q_keywords = query;
    }

    const response = await fetch('https://api.apollo.io/v1/mixed_people/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify(searchPayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro Apollo:', errorText);
      return c.json({
        success: false,
        error: `Apollo API retornou erro: ${response.status}`,
        details: errorText
      }, response.status);
    }

    const data = await response.json();

    console.log(`✅ Apollo retornou ${data.people?.length || 0} leads`);

    // 🔥 RETORNAR FORMATO BRUTO DA APOLLO (frontend vai processar)
    // Isso garante que first_name e last_name sejam preservados
    return c.json(data);

  } catch (error: any) {
    console.error('❌ Erro na busca de leads:', error);
    return c.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, 500);
  }
});

// ==========================================
// 🗄️ ROTA: Salvar Lead no KV Store
// ==========================================
app.post("/make-server-9e4b8b7c/leads/save", async (c) => {
  try {
    const body = await c.req.json();
    const { lead } = body;

    if (!lead || !lead.id) {
      return c.json({
        success: false,
        error: 'Lead inválido - ID é obrigatório'
      }, 400);
    }

    const key = `lead:${lead.id}`;
    
    await kvSet(key, {
      ...lead,
      savedAt: new Date().toISOString()
    });

    console.log(`✅ Lead salvo: ${lead.name} (${lead.id})`);

    return c.json({
      success: true,
      message: 'Lead salvo com sucesso',
      leadId: lead.id
    });

  } catch (error: any) {
    console.error('❌ Erro ao salvar lead:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// ==========================================
// 🗄️ ROTA: Listar Leads Salvos
// ==========================================
app.get("/make-server-9e4b8b7c/leads/list", async (c) => {
  try {
    const leads = await kvGetByPrefix('lead:');
    
    console.log(`✅ ${leads.length} leads encontrados no banco`);

    return c.json({
      success: true,
      leads: leads.map(l => l.value),
      total: leads.length
    });

  } catch (error: any) {
    console.error('❌ Erro ao listar leads:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// ==========================================
// 🗄️ ROTA: Obter Lead por ID
// ==========================================
app.get("/make-server-9e4b8b7c/leads/:id", async (c) => {
  try {
    const leadId = c.req.param('id');
    const key = `lead:${leadId}`;
    
    const lead = await kvGet(key);

    if (!lead) {
      return c.json({
        success: false,
        error: 'Lead não encontrado'
      }, 404);
    }

    return c.json({
      success: true,
      lead: lead
    });

  } catch (error: any) {
    console.error('❌ Erro ao buscar lead:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// ==========================================
// 🗄️ ROTA: Deletar Lead
// ==========================================
app.delete("/make-server-9e4b8b7c/leads/:id", async (c) => {
  try {
    const leadId = c.req.param('id');
    const key = `lead:${leadId}`;
    
    await kvDel(key);

    console.log(`✅ Lead deletado: ${leadId}`);

    return c.json({
      success: true,
      message: 'Lead deletado com sucesso'
    });

  } catch (error: any) {
    console.error('❌ Erro ao deletar lead:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// ==========================================
// 📧 ROTA: Verificar API Key do Resend
// ==========================================
app.get("/make-server-9e4b8b7c/email/check-api-key", async (c) => {
  try {
    const RESEND_API_KEY = getEnv('RESEND_API_KEY');
    
    if (!RESEND_API_KEY) {
      return c.json({
        configured: false,
        valid: false,
        message: 'RESEND_API_KEY não configurada'
      });
    }
    
    const isValid = RESEND_API_KEY.startsWith('re_') && RESEND_API_KEY.length >= 30;
    
    return c.json({
      configured: true,
      valid: isValid,
      preview: RESEND_API_KEY.substring(0, 10) + '...',
      length: RESEND_API_KEY.length
    });
  } catch (error: any) {
    return c.json({ 
      configured: false, 
      valid: false, 
      error: error.message 
    }, 500);
  }
});

// ==========================================
// 📊 ROTA: Estatísticas do Sistema
// ==========================================
app.get("/make-server-9e4b8b7c/stats", async (c) => {
  try {
    const leads = await kvGetByPrefix('lead:');
    
    return c.json({
      success: true,
      stats: {
        totalLeads: leads.length,
        timestamp: new Date().toISOString(),
        version: 'bundle-1.0.0'
      }
    });
  } catch (error: any) {
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// ==========================================
// 🔍 ROTA: Diagnóstico Completo
// ==========================================
app.get("/make-server-9e4b8b7c/diagnostics/full", async (c) => {
  try {
    const apolloKey = getEnv('APOLLO_API_KEY');
    const supabaseUrl = getEnv('SUPABASE_URL');
    const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY');
    const supabaseServiceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');
    
    // Testar KV Store
    let kvWorking = false;
    try {
      await kvSet('test:ping', { timestamp: new Date().toISOString() });
      const testValue = await kvGet('test:ping');
      kvWorking = !!testValue;
      await kvDel('test:ping');
    } catch (e) {
      console.error('KV Store error:', e);
    }

    return c.json({
      timestamp: new Date().toISOString(),
      version: 'bundle-1.0.0',
      environment: {
        APOLLO_API_KEY: !!apolloKey,
        SUPABASE_URL: !!supabaseUrl,
        SUPABASE_ANON_KEY: !!supabaseAnonKey,
        SUPABASE_SERVICE_ROLE_KEY: !!supabaseServiceKey
      },
      services: {
        kvStore: kvWorking,
        hono: true,
        cors: true
      },
      message: '✅ Diagnóstico completo realizado!'
    });
  } catch (error: any) {
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// ==========================================
// 404 - Rota não encontrada
// ==========================================
app.all("*", (c) => {
  return c.json({
    error: "Route not found",
    path: c.req.path,
    method: c.req.method,
    availableRoutes: [
      "GET /make-server-9e4b8b7c/health",
      "GET /make-server-9e4b8b7c/ping",
      "GET /make-server-9e4b8b7c/debug/env-vars",
      "GET /make-server-9e4b8b7c/search/test-apis",
      "POST /make-server-9e4b8b7c/search/leads",
      "POST /make-server-9e4b8b7c/leads/save",
      "GET /make-server-9e4b8b7c/leads/list",
      "GET /make-server-9e4b8b7c/leads/:id",
      "DELETE /make-server-9e4b8b7c/leads/:id",
      "GET /make-server-9e4b8b7c/email/check-api-key",
      "GET /make-server-9e4b8b7c/stats",
      "GET /make-server-9e4b8b7c/diagnostics/full"
    ]
  }, 404);
});

// ==========================================
// 🚀 INICIAR SERVIDOR
// ==========================================
console.log('');
console.log('✅ ImobHunter Server Bundle inicializado com sucesso!');
console.log('📍 Rotas disponíveis:');
console.log('   - GET /make-server-9e4b8b7c/health');
console.log('   - GET /make-server-9e4b8b7c/ping');
console.log('   - GET /make-server-9e4b8b7c/debug/env-vars');
console.log('   - GET /make-server-9e4b8b7c/search/test-apis');
console.log('   - POST /make-server-9e4b8b7c/search/leads');
console.log('   - GET /make-server-9e4b8b7c/leads/list');
console.log('   - GET /make-server-9e4b8b7c/diagnostics/full');
console.log('');

Deno.serve(app.fetch);