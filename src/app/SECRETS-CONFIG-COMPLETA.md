# 🔐 CONFIGURAÇÃO COMPLETA DAS SECRETS - COPIAR E COLAR

## 📍 ONDE CONFIGURAR

**Supabase Dashboard:**
https://app.supabase.com/project/nooknoilfqpfzujoddlp/settings/functions

**Caminho:** Settings → Edge Functions → Secrets → "Add new secret"

---

## ✅ SECRETS OBRIGATÓRIAS (Copie exatamente como está abaixo)

### 1️⃣ SUPABASE URL

**Nome da Secret (com espaços):**
```
SUPABASE URL
```

**Value (valor):**
```
https://nooknoilfqpfzujoddlp.supabase.co
```

---

### 2️⃣ SUPABASE ANON KEY

**Nome da Secret (com espaços):**
```
SUPABASE ANON KEY
```

**Value (valor):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vb2tub2lsZnFwZnp1am9kZGxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2MjA3NzcsImV4cCI6MjA4MTE5Njc3N30.wced3DsQJ9onkBLSP6rWmyuCHRuZc0emirIiekKt7ss
```

---

### 3️⃣ SUPABASE SERVICE ROLE KEY

**Nome da Secret (com espaços):**
```
SUPABASE SERVICE ROLE KEY
```

**Value (valor):**
```
⚠️ VOCÊ PRECISA PEGAR ESTA CHAVE NO SUPABASE!
```

**Como obter:**
1. Acesse: https://app.supabase.com/project/nooknoilfqpfzujoddlp/settings/api
2. Vá em "Project API keys"
3. Procure por **"service_role" key** (secret)
4. Clique em "Reveal" e copie o valor
5. Cole aqui

**IMPORTANTE:** Esta chave é PRIVADA e NÃO DEVE ser compartilhada publicamente!

---

### 4️⃣ APOLLO API KEY

**Nome da Secret (com espaços):**
```
APOLLO API KEY
```

**Value (valor):**
```
2MzD573PNPMUDo1kBRJUuA
```

---

## 📋 SECRETS OPCIONAIS (Para funcionalidades extras)

Configure apenas se você tiver as API keys:

### 5️⃣ HUNTER API KEY (Verificação de emails)

**Nome da Secret:**
```
HUNTER API KEY
```

**Value:**
```
SUA_CHAVE_HUNTER_AQUI
```

**Como obter:** https://hunter.io/api-keys

---

### 6️⃣ PDL API KEY (People Data Labs)

**Nome da Secret:**
```
PDL API KEY
```

**Value:**
```
SUA_CHAVE_PDL_AQUI
```

**Como obter:** https://dashboard.peopledatalabs.com/api-keys

---

### 7️⃣ PROXYCURL API KEY (LinkedIn data)

**Nome da Secret:**
```
PROXYCURL API KEY
```

**Value:**
```
SUA_CHAVE_PROXYCURL_AQUI
```

**Como obter:** https://nubela.co/proxycurl/dashboard

---

### 8️⃣ ROCKETREACH API KEY

**Nome da Secret:**
```
ROCKETREACH API KEY
```

**Value:**
```
SUA_CHAVE_ROCKETREACH_AQUI
```

**Como obter:** https://rocketreach.co/api

---

### 9️⃣ CLEARBIT API KEY

**Nome da Secret:**
```
CLEARBIT API KEY
```

**Value:**
```
SUA_CHAVE_CLEARBIT_AQUI
```

**Como obter:** https://dashboard.clearbit.com/api

---

### 🔟 LUSHA API KEY

**Nome da Secret:**
```
LUSHA API KEY
```

**Value:**
```
SUA_CHAVE_LUSHA_AQUI
```

**Como obter:** https://www.lusha.com/api/

---

### 1️⃣1️⃣ RESEND API KEY (Envio de emails)

**Nome da Secret:**
```
RESEND API KEY
```

**Value:**
```
SUA_CHAVE_RESEND_AQUI
```

**Como obter:** https://resend.com/api-keys

---

### 1️⃣2️⃣ RAPIDAPI KEY

**Nome da Secret:**
```
RAPIDAPI KEY
```

**Value:**
```
SUA_CHAVE_RAPIDAPI_AQUI
```

**Como obter:** https://rapidapi.com/developer/security

---

## 🎯 RESUMO - APENAS AS 4 ESSENCIAIS PARA COMEÇAR

Para fazer o sistema funcionar AGORA, configure apenas estas 4:

| Nome (COM ESPAÇOS) | Valor |
|-------------------|-------|
| `SUPABASE URL` | `https://nooknoilfqpfzujoddlp.supabase.co` |
| `SUPABASE ANON KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vb2tub2lsZnFwZnp1am9kZGxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2MjA3NzcsImV4cCI6MjA4MTE5Njc3N30.wced3DsQJ9onkBLSP6rWmyuCHRuZc0emirIiekKt7ss` |
| `SUPABASE SERVICE ROLE KEY` | ⚠️ **Pegar no Supabase → Settings → API → service_role key** |
| `APOLLO API KEY` | `2MzD573PNPMUDo1kBRJUuA` |

---

## 📸 PASSO A PASSO COM SCREENSHOTS

### 1. Acesse Supabase Dashboard

URL: https://app.supabase.com/project/nooknoilfqpfzujoddlp/settings/functions

### 2. Clique em "Add new secret"

### 3. Para cada secret:

**Nome:** `SUPABASE URL` ← **USE ESPAÇOS, NÃO UNDERSCORES!**

**Value:** `https://nooknoilfqpfzujoddlp.supabase.co` ← Cole o valor exato

### 4. Clique em "Save"

### 5. Repita para as outras 3 secrets essenciais

---

## ⚠️ CHECKLIST - ERROS COMUNS

Antes de salvar, verifique:

- [ ] ✅ Usei **ESPAÇOS** no nome (não underscores `_`)
  - ❌ Errado: `APOLLO_API_KEY`
  - ✅ Certo: `APOLLO API KEY`

- [ ] ✅ Colei o valor **SEM ESPAÇOS EXTRAS** no início/fim

- [ ] ✅ Não modifiquei o valor da chave (copiei exatamente)

- [ ] ✅ Configurei as 4 secrets essenciais

---

## 🧪 COMO TESTAR

### Opção 1: Via Logs do Servidor

Após configurar, acesse os logs das Edge Functions no Supabase.

Você deve ver:

```
🔍 ═══════════════════════════════════════════════════════
🔍 DIAGNÓSTICO DE VARIÁVEIS DE AMBIENTE (API KEYS)
🔍 ═══════════════════════════════════════════════════════
   ✅ APOLLO_API_KEY: 2MzD573PNP... (22 chars)
   ✅ SUPABASE_URL: https://noo... (48 chars)
   ✅ SUPABASE_ANON_KEY: eyJhbGc... (235 chars)
   ✅ SUPABASE_SERVICE_ROLE_KEY: eyJhbGc... (289 chars)
🔍 ═══════════════════════════════════════════════════════
```

Se aparecer `❌ NÃO CONFIGURADA`, algo está errado!

### Opção 2: Via Endpoint de Diagnóstico

Faça uma requisição GET para:

```
https://nooknoilfqpfzujoddlp.supabase.co/functions/v1/make-server-9e4b8b7c/debug/env-vars
```

Deve retornar JSON com as chaves configuradas.

---

## 🆘 TROUBLESHOOTING

### Problema: "Secret não encontrada"

**Causa:** Nome com underscores em vez de espaços

**Solução:** Delete e recrie com ESPAÇOS

---

### Problema: "401 Unauthorized" na Apollo

**Causa:** Chave Apollo incorreta ou expirada

**Solução:**
1. Verifique se é exatamente: `2MzD573PNPMUDo1kBRJUuA`
2. Se expirou, obtenha nova em: https://app.apollo.io/settings/integrations

---

### Problema: "SUPABASE_SERVICE_ROLE_KEY não encontrada"

**Causa:** Não configurou a service role key

**Solução:**
1. Acesse: https://app.supabase.com/project/nooknoilfqpfzujoddlp/settings/api
2. Seção "Project API keys"
3. Copie a **service_role** key (não a anon key!)
4. Cole no secret `SUPABASE SERVICE ROLE KEY` (com espaços)

---

## 🎉 APÓS CONFIGURAR

O sistema vai:

1. ✅ Detectar automaticamente as chaves (com fallback de espaços)
2. ✅ Mostrar logs de diagnóstico no boot
3. ✅ Funcionar sem erros de "API key não encontrada"
4. ✅ Buscar leads reais via Apollo.io

---

**Última atualização:** Dezembro 2024  
**Versão:** 1.0.0 - Adaptador de Secrets com Espaços
