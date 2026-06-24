# 🚀 DEPLOY MANUAL DO SERVIDOR - SUPABASE EDITOR

## ⚠️ PROBLEMA IDENTIFICADO

O código no Editor do Supabase está **ERRADO** (é o template padrão do Express).

Erro de deploy:
```
Expression expected at app.get(/slug/(.*)/, (req, res) => { ~).
```

---

## ✅ SOLUÇÃO: Copiar código correto para o Editor

### **PASSO 1: Abrir Editor do Supabase**

1. Acesse: https://app.supabase.com/project/nooknoilfqpfzujoddlp/functions/server
2. Clique na aba **"Code"** ou **"Editor"**
3. **DELETE TODO O CÓDIGO** que está lá

---

### **PASSO 2: Colar o código correto**

No Figma Make, o código do servidor está dividido em múltiplos arquivos:
- `/supabase/functions/server/index.tsx` (principal)
- `/supabase/functions/server/env-helper.ts` (adaptador de secrets)
- `/supabase/functions/server/search-routes.tsx` (rotas de busca)
- E mais 10+ arquivos...

**PROBLEMA:** O Editor do Supabase aceita apenas 1 arquivo!

**SOLUÇÃO:** Vou criar uma versão SIMPLIFICADA que funciona:

---

## 📝 CÓDIGO PARA COLAR (versão mínima funcionando)

**COPIE ESTE CÓDIGO COMPLETO** e cole no Editor do Supabase:

```typescript
// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

console.log('🚀 ImobHunter Server - Iniciando...');

import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";

// ==========================================
// 🔑 ENV HELPER - Adaptador de Secrets
// ==========================================
function getEnv(key: string): string | undefined {
  // Tenta com underscores primeiro
  let value = Deno.env.get(key);
  
  if (value) {
    return value;
  }
  
  // Fallback: tenta com espaços (limitação do Supabase)
  const keyWithSpaces = key.replace(/_/g, ' ');
  value = Deno.env.get(keyWithSpaces);
  
  if (value) {
    console.log(`⚠️ [ENV] "${key}" não encontrada, usando "${keyWithSpaces}"`);
    return value;
  }
  
  return undefined;
}

// ==========================================
// 🔍 DIAGNÓSTICO DE API KEYS
// ==========================================
console.log('🔍 ═══════════════════════════════════════════════════════');
console.log('🔍 DIAGNÓSTICO DE VARIÁVEIS DE AMBIENTE (API KEYS)');
console.log('🔍 ═══════════════════════════════════════════════════════');

const apiKeys = {
  'APOLLO_API_KEY': getEnv('APOLLO_API_KEY'),
  'SUPABASE_URL': getEnv('SUPABASE_URL'),
  'SUPABASE_ANON_KEY': getEnv('SUPABASE_ANON_KEY'),
  'SUPABASE_SERVICE_ROLE_KEY': getEnv('SUPABASE_SERVICE_ROLE_KEY')
};

Object.entries(apiKeys).forEach(([key, value]) => {
  if (value) {
    const preview = value.length > 10 ? `${value.substring(0, 10)}...` : value;
    console.log(`   ✅ ${key}: ${preview} (${value.length} chars)`);
  } else {
    console.log(`   ❌ ${key}: NÃO CONFIGURADA`);
  }
});

console.log('🔍 ═══════════════════════════════════════════════════════');

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
// 📍 ROTAS
// ==========================================

// Health check
app.get("/make-server-9e4b8b7c/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Ping (teste simples)
app.get("/make-server-9e4b8b7c/ping", (c) => {
  return c.json({ 
    status: "alive",
    timestamp: new Date().toISOString(),
    message: "✅ ImobHunter Server está funcionando!",
    version: "1.0.0"
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
    message: '✅ Servidor configurado e funcionando!'
  });
});

// Rota de teste de APIs
app.get("/make-server-9e4b8b7c/search/test-apis", async (c) => {
  const apolloKey = getEnv('APOLLO_API_KEY');
  
  const status: any = {
    apollo: {
      configured: !!apolloKey,
      keyLength: apolloKey?.length || 0,
      preview: apolloKey ? apolloKey.substring(0, 10) + '...' : 'N/A',
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

  return c.json({
    success: true,
    apis: status,
    summary: {
      configured: status.apollo.configured ? 1 : 0,
      valid: status.apollo.valid ? 1 : 0
    }
  });
});

// Rota padrão (404)
app.all("*", (c) => {
  return c.json({
    error: "Route not found",
    path: c.req.path,
    method: c.req.method,
    availableRoutes: [
      "GET /make-server-9e4b8b7c/health",
      "GET /make-server-9e4b8b7c/ping",
      "GET /make-server-9e4b8b7c/debug/env-vars",
      "GET /make-server-9e4b8b7c/search/test-apis"
    ]
  }, 404);
});

// ==========================================
// 🚀 INICIAR SERVIDOR
// ==========================================
console.log('');
console.log('✅ Servidor ImobHunter inicializado com sucesso!');
console.log('📍 Rotas disponíveis:');
console.log('   - GET /make-server-9e4b8b7c/health');
console.log('   - GET /make-server-9e4b8b7c/ping');
console.log('   - GET /make-server-9e4b8b7c/debug/env-vars');
console.log('   - GET /make-server-9e4b8b7c/search/test-apis');
console.log('');

Deno.serve(app.fetch);
```

---

## ✅ PASSO 3: Deploy

1. **Cole o código acima** no Editor do Supabase
2. **Clique em "Deploy"** (botão no topo direito)
3. **Aguarde 1-2 minutos** para o deploy completar
4. **Teste:** https://nooknoilfqpfzujoddlp.supabase.co/functions/v1/make-server-9e4b8b7c/ping

**Resposta esperada:**
```json
{
  "status": "alive",
  "timestamp": "2024-12-16T...",
  "message": "✅ ImobHunter Server está funcionando!",
  "version": "1.0.0"
}
```

---

## 🎯 PRÓXIMOS PASSOS

Depois que este código básico funcionar:

1. ✅ Teste `/ping` - deve funcionar
2. ✅ Teste `/debug/env-vars` - deve mostrar suas secrets
3. ✅ Teste `/search/test-apis` - deve validar Apollo
4. 📝 **Depois** podemos adicionar as rotas completas de busca

---

## ⚠️ NOTA IMPORTANTE

Este é um **servidor MÍNIMO** só para testar!

Para ter todas as funcionalidades (busca de leads, LinkedIn, etc), você precisará:

**OPÇÃO A:** Deploy via Supabase CLI (recomendado)
```bash
supabase functions deploy server --no-verify-jwt
```

**OPÇÃO B:** Eu crio um bundle único com TODAS as funcionalidades
(mais complexo, ~2000 linhas de código)

---

**Comece com o código acima e me diga se funcionou!** ✅
