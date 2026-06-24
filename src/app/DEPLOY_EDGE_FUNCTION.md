# 🚀 DEPLOY DO EDGE FUNCTION - BUSCA AVANÇADA

## ⚠️ PROBLEMA ATUAL

O erro `Failed to fetch` com CORS indica que o **Edge Function não foi deployado** ou está com problema de configuração.

---

## 📋 CHECKLIST DE DEPLOY

### ✅ **1. Verificar Arquivos Criados**

Confirme que estes arquivos existem:
```
/supabase/functions/server/
├── index.tsx ✅ (modificado com rota /advanced-search)
├── linkedin-api.ts ✅ (NOVO)
├── apollo-api.ts ✅ (NOVO)
└── ai-data-merger.ts ✅ (NOVO)
```

---

### ✅ **2. Verificar API Keys no Supabase**

As seguintes variáveis de ambiente DEVEM estar configuradas:

```
PROXYCURL_API_KEY=sua-chave-aqui
APOLLO_API_KEY=sua-chave-aqui
```

**Como configurar:**
1. Acesse: [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Project Settings** → **Edge Functions** → **Secrets**
4. Adicione as secrets:

```
Name: PROXYCURL_API_KEY
Value: [sua-chave-proxycurl]

Name: APOLLO_API_KEY
Value: [sua-chave-apollo]
```

---

### ✅ **3. Deploy Manual via Supabase CLI** (RECOMENDADO)

Se você tem acesso ao Supabase CLI:

```bash
# Navegar até a pasta do projeto
cd /path/to/project

# Deploy do Edge Function
supabase functions deploy server

# Verificar se deployou
supabase functions list
```

---

### ✅ **4. Deploy Automático via Figma Make**

O Figma Make pode fazer auto-deploy, mas você precisa **forçar um re-deploy**:

**Opção A: Adicionar comentário de força**
1. Abra `/supabase/functions/server/index.tsx`
2. Adicione um comentário no topo:
```typescript
// 🔄 FORCE DEPLOY: 2024-12-18-17:00
```
3. Salve o arquivo
4. O sistema deve detectar a mudança e fazer redeploy

**Opção B: Incrementar versão**
1. No arquivo `index.tsx`, procure por:
```typescript
console.log('📦 Version: 1.4.0 ...');
```
2. Mude para:
```typescript
console.log('📦 Version: 1.4.1 - FORCE REDEPLOY');
```
3. Salve

---

### ✅ **5. Testar Endpoint após Deploy**

Abra o navegador e teste diretamente:

```
https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/advanced-search/test
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "message": "Advanced search endpoint is ready",
  "timestamp": "2024-12-18T17:00:00.000Z",
  "apis": {
    "proxycurl": true,
    "apollo": true
  }
}
```

Se retornar `404` ou erro de CORS: **Edge Function NÃO está deployado**

---

### ✅ **6. Verificar Logs do Edge Function**

No Supabase Dashboard:
1. Vá em **Edge Functions** → **server**
2. Clique em **Logs**
3. Verifique se há erros de deploy:
   - ❌ "Module not found" → Falta algum arquivo
   - ❌ "Syntax error" → Erro de código
   - ✅ "Function ready" → Tudo ok!

---

## 🔧 SOLUÇÃO TEMPORÁRIA (MOCK)

Se o deploy estiver demorando, posso criar um **modo mock** que simula os resultados:

**Arquivo:** `/components/advanced-lead-search.tsx`

Adicionar após linha 100:

```typescript
// 🧪 MODO MOCK - Remover após deploy
const MOCK_MODE = true;

if (MOCK_MODE) {
  console.log('🧪 MODO MOCK ATIVADO - Simulando busca...');
  
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simula delay
  
  const mockResults: LeadResult[] = [
    {
      id: 'mock_1',
      type: 'person',
      name: 'João Silva',
      title: 'CEO',
      company: 'Tech Startup Inc.',
      location: 'São Paulo, Brasil',
      email: 'joao@techstartup.com',
      phone: '+55 11 99999-9999',
      linkedinUrl: 'https://linkedin.com/in/joaosilva',
      photoUrl: 'https://via.placeholder.com/150',
      confidence: 0.92,
      sources: ['linkedin', 'apollo'],
      dataQuality: {
        completeness: 0.85,
        accuracy: 0.92,
        freshness: 0.88
      },
      conflictResolutions: [
        {
          field: 'email',
          linkedinValue: 'joao@oldcompany.com',
          apolloValue: 'joao@techstartup.com',
          chosenValue: 'joao@techstartup.com',
          reason: 'Apollo mais confiável para emails (95% vs 70%)'
        }
      ]
    }
  ];
  
  setResults(mockResults);
  setIsSearching(false);
  return;
}
```

Isso permite testar a interface enquanto o backend é deployado.

---

## 🐛 DEBUGGING DETALHADO

### **Passo 1: Testar CORS**

No console do navegador (F12):

```javascript
fetch('https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/ping', {
  method: 'GET'
}).then(r => r.json()).then(console.log).catch(console.error);
```

**Se funcionar:** Endpoint `/ping` existe, logo o Edge Function está rodando
**Se falhar:** Edge Function não foi deployado

---

### **Passo 2: Testar Rota Específica**

```javascript
fetch('https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/advanced-search/test', {
  method: 'GET'
}).then(r => r.json()).then(console.log).catch(console.error);
```

**Se funcionar:** Rota `/advanced-search` existe
**Se falhar:** Rota não foi registrada (arquivo não foi incluído no deploy)

---

### **Passo 3: Testar POST com Dados**

```javascript
fetch('https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/advanced-search', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // Sua ANON_KEY
  },
  body: JSON.stringify({
    searchType: 'people',
    filters: { name: 'Test' }
  })
}).then(r => r.json()).then(console.log).catch(console.error);
```

**Se retornar resultados:** API está funcionando!
**Se retornar erro 500:** Problema nas APIs (Proxycurl/Apollo)
**Se falhar CORS:** Problema de configuração CORS

---

## 📊 STATUS DAS CORREÇÕES APLICADAS

✅ Rota corrigida: `/server/make-server-9e4b8b7c/` → `/make-server-9e4b8b7c/`
✅ Handler OPTIONS adicionado para CORS
✅ Endpoint de teste criado: `/advanced-search/test`
✅ Tratamento de erro melhorado no frontend
✅ Logs detalhados adicionados

---

## 🎯 PRÓXIMOS PASSOS

1. **Aguardar auto-deploy do Figma Make** (pode levar 2-5 minutos)
2. **OU fazer deploy manual via Supabase CLI**
3. Testar endpoint `/advanced-search/test`
4. Se funcionar, testar busca real
5. Se não funcionar, ativar modo MOCK temporário

---

## 📞 SUPORTE

Se o deploy não funcionar após 10 minutos:

1. Verificar se há erros nos logs do Supabase
2. Tentar deploy manual via CLI
3. Ativar modo MOCK para continuar desenvolvimento
4. Reportar erro específico para análise

---

**Status:** ⏳ Aguardando deploy...
**ETA:** ~5 minutos após última modificação
**Última modificação:** `index.tsx` - Correção de rota CORS
