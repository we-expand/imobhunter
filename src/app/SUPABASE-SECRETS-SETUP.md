# 🔐 CONFIGURAÇÃO DE SECRETS DO SUPABASE

## ⚠️ PROBLEMA IDENTIFICADO

O Supabase **NÃO ACEITA underscores (_)** nos nomes das variáveis de ambiente nas Edge Functions.

**Exemplo:**
- ❌ `APOLLO_API_KEY` → O Supabase remove os underscores
- ✅ `APOLLO API KEY` → É assim que fica salvo

---

## ✅ SOLUÇÃO IMPLEMENTADA

Foi criado um **adaptador automático** no servidor (`/supabase/functions/server/env-helper.ts`) que:

1. **Primeiro tenta** buscar a variável com underscores (padrão do código)
2. **Se não encontrar**, tenta buscar com espaços (limitação do Supabase)
3. **Funciona automaticamente** sem precisar alterar todo o código

### Exemplo prático:

```typescript
// ✅ ANTES (não funcionava):
const key = Deno.env.get('APOLLO_API_KEY');  // ❌ undefined

// ✅ AGORA (funciona automaticamente):
import { getEnv } from './env-helper.ts';
const key = getEnv('APOLLO_API_KEY');  
// Tenta 'APOLLO_API_KEY', se não achar, tenta 'APOLLO API KEY'
```

---

## 📋 SECRETS QUE VOCÊ PRECISA CONFIGURAR

Acesse: **Supabase Dashboard → Settings → Edge Functions → Secrets**

### 1. **Secrets Essenciais (obrigatórias)**

Configure exatamente com estes nomes (COM ESPAÇOS):

```
SUPABASE URL
SUPABASE ANON KEY  
SUPABASE SERVICE ROLE KEY
```

### 2. **API Key do Apollo.io (principal)**

```
APOLLO API KEY
```

**Valor:** `2MzD573PNPMUDo1kBRJUuA`

### 3. **Outras API Keys (opcionais para funcionalidades extras)**

```
HUNTER API KEY
PDL API KEY
ROCKETREACH API KEY
RAPIDAPI KEY
LUSHA API KEY
PROXYCURL API KEY
CLEARBIT API KEY
RESEND API KEY
```

---

## 🎯 COMO CONFIGURAR NO SUPABASE

### Passo a passo:

1. **Acesse:** https://app.supabase.com
2. **Selecione** seu projeto: `nooknoilfqpfzujoddlp`
3. **Navegue:** Settings → Edge Functions → Secrets
4. **Clique:** "Add new secret"
5. **Digite o nome** (COM ESPAÇOS, sem underscores):
   - Exemplo: `APOLLO API KEY`
6. **Cole o valor da chave**
7. **Salve**

### ⚠️ IMPORTANTE:

- ✅ **USE ESPAÇOS** em vez de underscores
- ✅ Cole a chave **SEM ESPAÇOS EXTRAS** no início/fim
- ✅ Depois de salvar, **reinicie as Edge Functions** (deploy automático)

---

## 🧪 COMO TESTAR SE FUNCIONOU

### 1. Via endpoint de diagnóstico:

```bash
GET https://nooknoilfqpfzujoddlp.supabase.co/functions/v1/make-server-9e4b8b7c/debug/env-vars
```

### 2. Via logs do servidor:

Quando o servidor iniciar, você verá:

```
🔍 ═══════════════════════════════════════════════════════
🔍 DIAGNÓSTICO DE VARIÁVEIS DE AMBIENTE (API KEYS)
🔍 ═══════════════════════════════════════════════════════
   ✅ APOLLO_API_KEY: 2MzD573PNP... (22 chars)
   ✅ SUPABASE_URL: https://noo... (48 chars)
   ✅ SUPABASE_ANON_KEY: eyJhbGc... (200+ chars)
🔍 ═══════════════════════════════════════════════════════
```

### 3. Se aparecer o fallback:

```
⚠️ [ENV] "APOLLO_API_KEY" não encontrada, usando "APOLLO API KEY"
```

Isso significa que o adaptador está funcionando! ✅

---

## 📝 ARQUIVOS ATUALIZADOS

Todos os arquivos do servidor foram atualizados para usar `getEnv()`:

- ✅ `/supabase/functions/server/index.tsx`
- ✅ `/supabase/functions/server/search-routes.tsx`
- ✅ `/supabase/functions/server/api-test-routes.tsx`
- ✅ `/supabase/functions/server/linkedin-routes.ts`
- ✅ `/supabase/functions/server/web-search-service.ts`

---

## 🎉 PRÓXIMOS PASSOS

1. **Configure as 4 secrets essenciais** no Supabase (com espaços)
2. **Aguarde** o deploy automático das Edge Functions
3. **Teste** acessando a aplicação
4. **Verifique os logs** para confirmar que as chaves foram encontradas

---

## ❓ TROUBLESHOOTING

### Problema: "API Key não encontrada"

**Solução:**
1. Verifique se usou ESPAÇOS (não underscores)
2. Certifique-se que colou o valor correto
3. Aguarde 30-60 segundos para o deploy

### Problema: "401 Unauthorized"

**Solução:**
- A chave Apollo está incorreta
- Verifique se é: `2MzD573PNPMUDo1kBRJUuA`
- Confira se não tem espaços extras

### Problema: Servidor não inicia

**Solução:**
- Veja os logs das Edge Functions no Supabase
- Procure por erros de sintaxe ou imports

---

## 📞 SUPORTE

Se precisar de ajuda, forneça:
1. Screenshot da tela de Secrets do Supabase
2. Logs do servidor (primeiros 50 linhas)
3. Mensagem de erro específica

---

**Última atualização:** Dezembro 2024
**Versão do adaptador:** 1.0.0
