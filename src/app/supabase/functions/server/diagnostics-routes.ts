import { Hono } from 'npm:hono';

const app = new Hono();

// 🔍 Helper function para o diagnóstico
async function getDiagnosticsData() {
  const apis = [];
  
  // 1. Apollo.io
  const apolloKey = Deno.env.get('APOLLO_API_KEY');
  apis.push({
    name: 'Apollo.io',
    key: 'APOLLO_API_KEY',
    configured: !!apolloKey,
    valid: apolloKey && apolloKey !== 'YOUR_APOLLO_API_KEY' && apolloKey.length > 10,
    preview: apolloKey ? `${apolloKey.substring(0, 8)}...` : undefined,
    error: !apolloKey ? 'Variável de ambiente não definida' : 
           apolloKey === 'YOUR_APOLLO_API_KEY' ? 'Usando valor placeholder' :
           apolloKey.length <= 10 ? 'Key muito curta' : undefined,
  });
  
  // 2. Hunter.io
  const hunterKey = Deno.env.get('HUNTER_API_KEY');
  apis.push({
    name: 'Hunter.io',
    key: 'HUNTER_API_KEY',
    configured: !!hunterKey,
    valid: hunterKey && hunterKey !== 'YOUR_HUNTER_API_KEY' && hunterKey.length > 10,
    preview: hunterKey ? `${hunterKey.substring(0, 8)}...` : undefined,
    error: !hunterKey ? 'Variável de ambiente não definida' : 
           hunterKey === 'YOUR_HUNTER_API_KEY' ? 'Usando valor placeholder' :
           hunterKey.length <= 10 ? 'Key muito curta' : undefined,
  });
  
  // 3. People Data Labs (PDL)
  const pdlKey = Deno.env.get('PDL_API_KEY');
  apis.push({
    name: 'People Data Labs',
    key: 'PDL_API_KEY',
    configured: !!pdlKey,
    valid: pdlKey && pdlKey !== 'YOUR_PDL_API_KEY' && pdlKey.length > 10,
    preview: pdlKey ? `${pdlKey.substring(0, 8)}...` : undefined,
    error: !pdlKey ? 'Variável de ambiente não definida' : 
           pdlKey === 'YOUR_PDL_API_KEY' ? 'Usando valor placeholder' :
           pdlKey.length <= 10 ? 'Key muito curta' : undefined,
  });
  
  // 4. RocketReach
  const rocketKey = Deno.env.get('ROCKETREACH_API_KEY');
  apis.push({
    name: 'RocketReach',
    key: 'ROCKETREACH_API_KEY',
    configured: !!rocketKey,
    valid: rocketKey && rocketKey !== 'YOUR_ROCKETREACH_API_KEY' && rocketKey.length > 10,
    preview: rocketKey ? `${rocketKey.substring(0, 8)}...` : undefined,
    error: !rocketKey ? 'Variável de ambiente não definida' : 
           rocketKey === 'YOUR_ROCKETREACH_API_KEY' ? 'Usando valor placeholder' :
           rocketKey.length <= 10 ? 'Key muito curta' : undefined,
  });
  
  // 5. Clearbit (para empresas)
  const clearbitKey = Deno.env.get('CLEARBIT_API_KEY');
  apis.push({
    name: 'Clearbit',
    key: 'CLEARBIT_API_KEY',
    configured: !!clearbitKey,
    valid: clearbitKey && clearbitKey !== 'YOUR_CLEARBIT_API_KEY' && clearbitKey.length > 10,
    preview: clearbitKey ? `${clearbitKey.substring(0, 8)}...` : undefined,
    error: !clearbitKey ? 'Variável de ambiente não definida' : 
           clearbitKey === 'YOUR_CLEARBIT_API_KEY' ? 'Usando valor placeholder' :
           clearbitKey.length <= 10 ? 'Key muito curta' : undefined,
  });
  
  const configuredCount = apis.filter(api => api.configured && api.valid).length;
  
  console.log('');
  console.log('═══════════════════════════════════════════════');
  console.log('🔍 DIAGNÓSTICO DE API KEYS');
  console.log('═══════════════════════════════════════════════');
  console.log(`📊 ${configuredCount}/${apis.length} APIs válidas e prontas para uso`);
  console.log('');
  
  apis.forEach(api => {
    const status = api.configured && api.valid ? '✅' : api.configured ? '⚠️' : '❌';
    const message = api.error || 'Configurada e válida';
    console.log(`   ${status} ${api.name.padEnd(20)} - ${message}`);
  });
  
  console.log('═══════════════════════════════════════════════');
  console.log('');
  
  return {
    success: true,
    apis,
    summary: {
      total: apis.length,
      configured: configuredCount,
      unconfigured: apis.length - configuredCount,
    },
  };
}

// 🔍 ROTA RAIZ - Retorna diagnóstico
app.get('/', async (c) => {
  try {
    console.log('🔍 Diagnóstico de API Keys solicitado (rota /)');
    const data = await getDiagnosticsData();
    return c.json(data);
  } catch (error) {
    console.error('❌ Erro no diagnóstico:', error);
    return c.json({
      success: false,
      error: error.message,
    }, 500);
  }
});

// 🔍 DIAGNÓSTICO DE API KEYS - Verifica todas as APIs de busca
app.get('/api-keys', async (c) => {
  try {
    console.log('🔍 Diagnóstico de API Keys solicitado (rota /api-keys)');
    const data = await getDiagnosticsData();
    return c.json(data);
  } catch (error) {
    console.error('❌ Erro no diagnóstico:', error);
    return c.json({
      success: false,
      error: error.message,
    }, 500);
  }
});

export default app;
