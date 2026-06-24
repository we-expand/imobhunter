import { Hono } from 'npm:hono';
import { generateDemoLeads } from './demo-leads-generator.ts';
import * as kvStore from './kv_store.tsx';

const app = new Hono();

// Rota de busca de leads
app.post('/leads', async (c) => {
  try {
    const body = await c.req.json();
    console.log('🔍 Buscando leads:', body);
    
    const leads = generateDemoLeads({
      currentTitle: body.title,
      currentCompany: body.company,
      city: body.city,
      country: body.country,
      industry: body.industry,
      seniority: body.seniority,
      limit: body.limit || 25
    });
    
    return c.json({
      success: true,
      leads,
      total: leads.length
    });
  } catch (error) {
    console.error('❌ Erro na busca:', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, 500);
  }
});

// Rota de configuração de API keys
app.post('/config/api-keys', async (c) => {
  try {
    const body = await c.req.json();
    const { apolloKey, hunterKey, pdlKey, rocketKey, proxycurlKey } = body;
    
    if (apolloKey) await kvStore.set('api_key_apollo', apolloKey);
    if (hunterKey) await kvStore.set('api_key_hunter', hunterKey);
    if (pdlKey) await kvStore.set('api_key_pdl', pdlKey);
    if (rocketKey) await kvStore.set('api_key_rocketreach', rocketKey);
    if (proxycurlKey) await kvStore.set('api_key_proxycurl', proxycurlKey);
    
    return c.json({ success: true, message: 'API Keys atualizadas' });
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.get('/config/api-keys', async (c) => {
  try {
    const apolloKey = await kvStore.get('api_key_apollo');
    const hunterKey = await kvStore.get('api_key_hunter');
    const pdlKey = await kvStore.get('api_key_pdl');
    const rocketKey = await kvStore.get('api_key_rocketreach');
    const proxycurlKey = await kvStore.get('api_key_proxycurl');
    
    return c.json({
      apolloKey: apolloKey ? apolloKey.substring(0, 8) + '...' : null,
      hunterKey: hunterKey ? hunterKey.substring(0, 8) + '...' : null,
      pdlKey: pdlKey ? pdlKey.substring(0, 8) + '...' : null,
      rocketKey: rocketKey ? rocketKey.substring(0, 8) + '...' : null,
      proxycurlKey: proxycurlKey ? proxycurlKey.substring(0, 8) + '...' : null,
    });
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

export default app;
