# 🚀 DEPLOY MANUAL - Edge Function ImobHunter

## 📋 **INSTRUÇÕES PASSO A PASSO:**

### **PASSO 1: Acessar Supabase**
1. Vá para: https://app.supabase.com/project/nooknoilfqpfzujoddlp/functions
2. Clique em **"Create new function"**
3. Nome da função: `make-server-9e4b8b7c`
4. Clique em **"Create function"**

---

### **PASSO 2: Substituir o código**

Na aba do editor que abrir, **APAGUE TODO O CÓDIGO** e cole o código abaixo.

**⚠️ IMPORTANTE:** O código está dividido em 2 arquivos. Você precisa criar AMBOS.

---

## 📄 **ARQUIVO 1: index.ts**

Crie o arquivo `index.ts` com este conteúdo:

```typescript
console.log('🚀 ImobHunter API iniciando...');

import { Hono } from "npm:hono@4";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";

const app = new Hono();

// Enable CORS
app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
}));

// Enable logger
app.use('*', logger(console.log));

// Helper para pegar env vars
function getEnv(key: string): string {
  return Deno.env.get(key) || '';
}

// ==========================================
// ROTAS BÁSICAS
// ==========================================

app.get("/make-server-9e4b8b7c/health", (c) => {
  return c.json({ status: "ok", service: "ImobHunter", version: "1.0.0" });
});

app.get("/make-server-9e4b8b7c/ping", (c) => {
  return c.json({ 
    status: "alive",
    timestamp: new Date().toISOString(),
    message: "ImobHunter API funcionando! ✅"
  });
});

// ==========================================
// DIAGNÓSTICO DE API KEYS
// ==========================================

app.get("/make-server-9e4b8b7c/diagnostics/api-keys", (c) => {
  const keys = {
    'APOLLO_API_KEY': getEnv('APOLLO_API_KEY'),
    'HUNTER_API_KEY': getEnv('HUNTER_API_KEY'),
    'PDL_API_KEY': getEnv('PDL_API_KEY'),
    'PROXYCURL_API_KEY': getEnv('PROXYCURL_API_KEY'),
    'ROCKETREACH_API_KEY': getEnv('ROCKETREACH_API_KEY'),
    'LUSHA_API_KEY': getEnv('LUSHA_API_KEY'),
    'CLEARBIT_API_KEY': getEnv('CLEARBIT_API_KEY'),
    'PIPL_API_KEY': getEnv('PIPL_API_KEY'),
    'FULLCONTACT_API_KEY': getEnv('FULLCONTACT_API_KEY'),
    'RAPIDAPI_KEY': getEnv('RAPIDAPI_KEY'),
  };

  const diagnostics = Object.entries(keys).map(([key, value]) => ({
    name: key,
    configured: !!value && value.length > 0,
    length: value?.length || 0,
    preview: value ? value.substring(0, 10) + '...' : 'N/A'
  }));

  return c.json({
    timestamp: new Date().toISOString(),
    keys: diagnostics,
    summary: {
      total: diagnostics.length,
      configured: diagnostics.filter(k => k.configured).length,
      missing: diagnostics.filter(k => !k.configured).length
    }
  });
});

// ==========================================
// BUSCA DE LEADS - APOLLO.IO
// ==========================================

app.post("/make-server-9e4b8b7c/search/people", async (c) => {
  try {
    const body = await c.req.json();
    const APOLLO_API_KEY = getEnv('APOLLO_API_KEY');

    if (!APOLLO_API_KEY) {
      return c.json({
        success: false,
        error: 'APOLLO_API_KEY não configurada'
      }, 500);
    }

    console.log('🔍 Buscando leads via Apollo.io...');

    // Construir query Apollo
    const apolloQuery: any = {
      api_key: APOLLO_API_KEY,
      page: 1,
      per_page: body.limit || 25,
    };

    // Adicionar filtros
    if (body.location) {
      apolloQuery.person_locations = [body.location];
    }

    if (body.jobTitles && body.jobTitles.length > 0) {
      apolloQuery.person_titles = body.jobTitles;
    }

    if (body.industries && body.industries.length > 0) {
      apolloQuery.organization_industry_tag_ids = body.industries;
    }

    if (body.companySize) {
      apolloQuery.organization_num_employees_ranges = [body.companySize];
    }

    console.log('📡 Query Apollo:', apolloQuery);

    const response = await fetch('https://api.apollo.io/v1/mixed_people/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify(apolloQuery)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Erro Apollo:', data);
      return c.json({
        success: false,
        error: data.error || 'Erro ao buscar leads',
        details: data
      }, response.status);
    }

    console.log(`✅ Encontrados ${data.people?.length || 0} leads`);

    // Formatar leads
    const leads = (data.people || []).map((person: any) => ({
      id: person.id,
      name: person.name,
      email: person.email,
      phone: person.phone_numbers?.[0]?.sanitized_number,
      company: person.organization?.name,
      title: person.title,
      location: person.city,
      linkedinUrl: person.linkedin_url,
      score: Math.floor(Math.random() * 40) + 60, // Score simulado
      source: 'Apollo.io'
    }));

    return c.json({
      success: true,
      leads,
      total: data.pagination?.total_entries || leads.length,
      page: data.pagination?.page || 1
    });

  } catch (error: any) {
    console.error('❌ Erro na busca:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// ==========================================
// ADMIN - GESTÃO DE DADOS
// ==========================================

app.get("/make-server-9e4b8b7c/admin/check-init", (c) => {
  return c.json({ initialized: true });
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================

console.log('✅ Rotas configuradas!');
console.log('🎯 Servidor pronto para receber requisições');

Deno.serve(app.fetch);
```

---

## ✅ **PASSO 3: Deploy**

1. Clique em **"Deploy"** (botão verde no canto superior direito)
2. Aguarde o deploy completar (~30 segundos)
3. Quando aparecer "Deployed successfully" ✅

---

## 🧪 **PASSO 4: Testar**

Abra uma nova aba e vá para:
```
https://nooknoilfqpfzujoddlp.supabase.co/functions/v1/make-server-9e4b8b7c/ping
```

Deve retornar:
```json
{
  "status": "alive",
  "timestamp": "2024-...",
  "message": "ImobHunter API funcionando! ✅"
}
```

---

## 🎉 **SE DEU CERTO:**

1. Volte para o ImobHunter (recarregue a página)
2. Faça login
3. O card de debug deve mostrar **✅ make-server-9e4b8b7c**
4. A busca de leads deve funcionar!

---

## ❌ **SE DER ERRO:**

Me envie:
1. Screenshot do erro no Supabase
2. Screenshot do card de debug
3. Console do navegador (F12)

**👉 ME DIGA SE FUNCIONOU! 🚀**
