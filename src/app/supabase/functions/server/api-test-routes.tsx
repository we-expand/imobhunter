import { Hono } from "npm:hono";
import { getEnv } from "./env-helper.ts";

const apiTestRouter = new Hono();

// 🧪 ENDPOINT DE TESTE - Verifica status de todas as APIs
apiTestRouter.get('/test-apis', async (c) => {
  console.log('🧪 [API TEST] Iniciando teste de APIs...');
  
  const apiStatus: any = {};
  
  // Lista de todas as API keys
  const apiKeys = {
    'APOLLO_API_KEY': getEnv('APOLLO_API_KEY'),
    'PDL_API_KEY': getEnv('PDL_API_KEY'),
    'HUNTER_API_KEY': getEnv('HUNTER_API_KEY'),
    'ROCKETREACH_API_KEY': getEnv('ROCKETREACH_API_KEY'),
    'PROXYCURL_API_KEY': getEnv('PROXYCURL_API_KEY'),
    'CLEARBIT_API_KEY': getEnv('CLEARBIT_API_KEY'),
    'LUSHA_API_KEY': getEnv('LUSHA_API_KEY'),
    'RAPIDAPI_KEY': getEnv('RAPIDAPI_KEY'),
  };
  
  // Testar cada API
  for (const [key, value] of Object.entries(apiKeys)) {
    const configured = !!value;
    const masked = value ? `${value.substring(0, 8)}...${value.substring(value.length - 4)}` : 'Não configurada';
    
    apiStatus[key] = {
      configured,
      masked,
      valid: null, // Será testado abaixo
      length: value?.length || 0
    };
    
    console.log(`🔑 ${key}: ${configured ? '✅ Configurada' : '❌ Não configurada'} (${masked})`);
  }
  
  // Teste específico do Apollo
  if (apiKeys.APOLLO_API_KEY) {
    try {
      console.log('🧪 [API TEST] Testando Apollo...');
      const apolloResponse = await fetch('https://api.apollo.io/v1/auth/health', {
        headers: {
          'X-Api-Key': apiKeys.APOLLO_API_KEY
        }
      });
      
      apiStatus.APOLLO_API_KEY.valid = apolloResponse.ok;
      apiStatus.APOLLO_API_KEY.statusCode = apolloResponse.status;
      
      if (!apolloResponse.ok) {
        const errorText = await apolloResponse.text();
        apiStatus.APOLLO_API_KEY.error = errorText;
        console.log(`❌ Apollo inválida: ${apolloResponse.status} - ${errorText}`);
      } else {
        console.log('✅ Apollo válida!');
      }
    } catch (error: any) {
      apiStatus.APOLLO_API_KEY.error = error.message;
      console.log(`❌ Apollo erro: ${error.message}`);
    }
  }
  
  // Teste específico do PDL
  if (apiKeys.PDL_API_KEY) {
    try {
      console.log('🧪 [API TEST] Testando PDL...');
      // PDL não tem endpoint de health, vamos fazer uma busca vazia para testar
      const pdlResponse = await fetch('https://api.peopledatalabs.com/v5/person/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': apiKeys.PDL_API_KEY
        },
        body: JSON.stringify({
          query: {
            name: 'test_validation_only'
          },
          size: 1
        })
      });
      
      apiStatus.PDL_API_KEY.valid = pdlResponse.ok || pdlResponse.status === 400; // 400 = key válida mas query ruim
      apiStatus.PDL_API_KEY.statusCode = pdlResponse.status;
      
      if (pdlResponse.status === 401) {
        const errorData = await pdlResponse.json();
        apiStatus.PDL_API_KEY.error = errorData.error?.message || 'Invalid API key';
        console.log(`❌ PDL inválida: ${JSON.stringify(errorData)}`);
      } else {
        console.log('✅ PDL válida!');
      }
    } catch (error: any) {
      apiStatus.PDL_API_KEY.error = error.message;
      console.log(`❌ PDL erro: ${error.message}`);
    }
  }
  
  // Teste específico do Hunter
  if (apiKeys.HUNTER_API_KEY) {
    try {
      console.log('🧪 [API TEST] Testando Hunter...');
      const hunterResponse = await fetch(`https://api.hunter.io/v2/account?api_key=${apiKeys.HUNTER_API_KEY}`);
      
      apiStatus.HUNTER_API_KEY.valid = hunterResponse.ok;
      apiStatus.HUNTER_API_KEY.statusCode = hunterResponse.status;
      
      if (!hunterResponse.ok) {
        const errorData = await hunterResponse.json();
        apiStatus.HUNTER_API_KEY.error = errorData.errors?.[0]?.details || 'Invalid API key';
        console.log(`❌ Hunter inválida: ${JSON.stringify(errorData)}`);
      } else {
        const data = await hunterResponse.json();
        apiStatus.HUNTER_API_KEY.accountInfo = {
          email: data.data?.email,
          calls_used: data.data?.calls?.used,
          calls_available: data.data?.calls?.available
        };
        console.log('✅ Hunter válida!', apiStatus.HUNTER_API_KEY.accountInfo);
      }
    } catch (error: any) {
      apiStatus.HUNTER_API_KEY.error = error.message;
      console.log(`❌ Hunter erro: ${error.message}`);
    }
  }
  
  console.log('🧪 [API TEST] Teste completo!');
  console.log('🧪 ═══════════════════════════════════════════════════════');
  
  return c.json({
    success: true,
    timestamp: new Date().toISOString(),
    apis: apiStatus,
    summary: {
      total: Object.keys(apiKeys).length,
      configured: Object.values(apiStatus).filter((s: any) => s.configured).length,
      valid: Object.values(apiStatus).filter((s: any) => s.valid === true).length,
      invalid: Object.values(apiStatus).filter((s: any) => s.valid === false).length
    }
  });
});

// 📖 ENDPOINT DE INSTRUÇÕES - Como configurar cada API
apiTestRouter.get('/setup-instructions', (c) => {
  return c.json({
    instructions: {
      APOLLO_API_KEY: {
        name: 'Apollo.io',
        url: 'https://app.apollo.io/settings/integrations',
        steps: [
          '1. Acesse https://app.apollo.io/settings/integrations',
          '2. Faça login ou crie uma conta gratuita',
          '3. Vá em "API" na barra lateral',
          '4. Clique em "Create New Key"',
          '5. Copie a chave gerada',
          '6. No Supabase Dashboard, vá em Project Settings > Edge Functions > Secrets',
          '7. Adicione APOLLO_API_KEY com o valor copiado'
        ],
        pricing: 'Plano grátis: 50 créditos/mês',
        required: true
      },
      PDL_API_KEY: {
        name: 'People Data Labs',
        url: 'https://dashboard.peopledatalabs.com/api-keys',
        steps: [
          '1. Acesse https://www.peopledatalabs.com/',
          '2. Clique em "Start Free Trial"',
          '3. Crie sua conta',
          '4. Vá em Settings > API Keys',
          '5. Copie sua API key',
          '6. No Supabase Dashboard, vá em Project Settings > Edge Functions > Secrets',
          '7. Adicione PDL_API_KEY com o valor copiado'
        ],
        pricing: 'Plano grátis: 1.000 créditos de teste',
        required: true
      },
      HUNTER_API_KEY: {
        name: 'Hunter.io',
        url: 'https://hunter.io/api-keys',
        steps: [
          '1. Acesse https://hunter.io/',
          '2. Crie uma conta gratuita',
          '3. Vá em "API" no menu',
          '4. Clique em "API Keys"',
          '5. Copie sua API key',
          '6. No Supabase Dashboard, vá em Project Settings > Edge Functions > Secrets',
          '7. Adicione HUNTER_API_KEY com o valor copiado'
        ],
        pricing: 'Plano grátis: 25 buscas/mês',
        required: false
      },
      PROXYCURL_API_KEY: {
        name: 'Proxycurl (LinkedIn)',
        url: 'https://nubela.co/proxycurl/pricing',
        steps: [
          '1. Acesse https://nubela.co/proxycurl/',
          '2. Clique em "Start Free Trial"',
          '3. Crie sua conta',
          '4. Vá em Dashboard > API Keys',
          '5. Copie sua API key',
          '6. No Supabase Dashboard, vá em Project Settings > Edge Functions > Secrets',
          '7. Adicione PROXYCURL_API_KEY com o valor copiado'
        ],
        pricing: '10 créditos grátis para teste',
        required: false
      },
      ROCKETREACH_API_KEY: {
        name: 'RocketReach',
        url: 'https://rocketreach.co/api',
        steps: [
          '1. Acesse https://rocketreach.co/',
          '2. Crie uma conta',
          '3. Vá em Settings > API',
          '4. Gere uma nova API key',
          '5. Copie a chave',
          '6. No Supabase Dashboard, vá em Project Settings > Edge Functions > Secrets',
          '7. Adicione ROCKETREACH_API_KEY com o valor copiado'
        ],
        pricing: 'Plano pago',
        required: false
      },
      CLEARBIT_API_KEY: {
        name: 'Clearbit',
        url: 'https://dashboard.clearbit.com/api',
        steps: [
          '1. Acesse https://clearbit.com/',
          '2. Crie uma conta',
          '3. Vá em Settings > API Keys',
          '4. Copie sua API key',
          '5. No Supabase Dashboard, vá em Project Settings > Edge Functions > Secrets',
          '6. Adicione CLEARBIT_API_KEY com o valor copiado'
        ],
        pricing: 'Trial disponível',
        required: false
      },
      LUSHA_API_KEY: {
        name: 'Lusha',
        url: 'https://www.lusha.com/api/',
        steps: [
          '1. Acesse https://www.lusha.com/',
          '2. Crie uma conta',
          '3. Vá em Settings > API',
          '4. Gere uma API key',
          '5. Copie a chave',
          '6. No Supabase Dashboard, vá em Project Settings > Edge Functions > Secrets',
          '7. Adicione LUSHA_API_KEY com o valor copiado'
        ],
        pricing: 'Créditos limitados no plano grátis',
        required: false
      }
    },
    supabaseInstructions: {
      title: 'Como Adicionar Secrets no Supabase',
      steps: [
        '1. Acesse o Supabase Dashboard: https://supabase.com/dashboard',
        '2. Selecione seu projeto',
        '3. Vá em "Project Settings" (ícone de engrenagem no canto inferior esquerdo)',
        '4. Clique em "Edge Functions" na barra lateral',
        '5. Role até a seção "Secrets"',
        '6. Clique em "Add new secret"',
        '7. Preencha o nome (ex: APOLLO_API_KEY) e o valor (a chave da API)',
        '8. Clique em "Save"',
        '9. Aguarde alguns segundos para a secret ser propagada',
        '10. Reinicie o Edge Function (ou ele reinicia automaticamente)'
      ]
    }
  });
});

export default apiTestRouter;
