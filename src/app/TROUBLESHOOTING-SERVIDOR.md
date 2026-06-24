# 🔧 TROUBLESHOOTING - Servidor não responde

## ❌ Erro encontrado:

```json
{"code":"NO_EXPORT","message":"Requested function was not found"}
```

---

## 🔍 DIAGNÓSTICO

Este erro significa que:

1. **A Edge Function não está deployada** OU
2. **O servidor tem erros de sintaxe** OU
3. **As variáveis de ambiente estão erradas**

---

## ✅ SOLUÇÕES (siga em ordem)

### 1️⃣ VERIFICAR SE O SERVIDOR ESTÁ DEPLOYADO

**Acesse os logs do Supabase:**

```
https://app.supabase.com/project/nooknoilfqpfzujoddlp/functions/server/logs
```

**Ou via URL direta:**

```
Settings → Edge Functions → server → Logs
```

**O que procurar:**

✅ **Logs de boot (servidor iniciando):**
```
[BOOT] 1/17 - Importando Hono...
[BOOT] 2/17 - Importando CORS...
...
[BOOT] ✅ Todos os imports concluídos!
```

✅ **Diagnóstico de API keys:**
```
🔍 ═══════════════════════════════════════════════════════
🔍 DIAGNÓSTICO DE VARIÁVEIS DE AMBIENTE (API KEYS)
🔍 ═══════════════════════════════════════════════════════
   ✅ APOLLO_API_KEY: 2MzD573PNP... (22 chars)
   ✅ SUPABASE_URL: https://noo... (48 chars)
```

❌ **Se você vê erros:**
```
error: Uncaught ...
```

Isso indica problema no código ou variáveis.

---

### 2️⃣ FORÇAR REDEPLOY DA EDGE FUNCTION

**Via Supabase CLI (se tiver instalado):**

```bash
supabase functions deploy server
```

**Via Dashboard (mais fácil):**

1. Acesse: https://app.supabase.com/project/nooknoilfqpfzujoddlp/functions
2. Encontre a função **"server"**
3. Clique nos **3 pontinhos** → **Redeploy**
4. Aguarde 30-60 segundos

---

### 3️⃣ TESTAR COM ENDPOINT MAIS SIMPLES

Tente acessar o endpoint de PING (mais simples):

```
https://nooknoilfqpfzujoddlp.supabase.co/functions/v1/make-server-9e4b8b7c/ping
```

**Resposta esperada:**
```json
{
  "status": "alive",
  "timestamp": "2024-12-16T...",
  "message": "Servidor está funcionando! ✅"
}
```

Se este funcionar mas o `/debug/env-vars` não, há um problema na rota específica.

---

### 4️⃣ VERIFICAR SECRETS NO SUPABASE

**Acesse:**
```
https://app.supabase.com/project/nooknoilfqpfzujoddlp/settings/functions
```

**Secrets que DEVEM estar presentes (COM ESPAÇOS):**

```
✅ SUPABASE URL
✅ SUPABASE ANON KEY
✅ SUPABASE SERVICE ROLE KEY
✅ APOLLO API KEY
```

**Erros comuns:**

❌ `SUPABASE_URL` (com underscore) → Não funciona!
✅ `SUPABASE URL` (com espaço) → Correto!

**Se as secrets estão corretas:**

Clique em **"Redeploy all functions"** para aplicar as mudanças.

---

### 5️⃣ VERIFICAR DENO.JSON E IMPORTS

O Supabase precisa do arquivo `deno.json` configurado corretamente.

**Verifique se existe:**
```
/supabase/functions/deno.json
```

**Deve conter:**
```json
{
  "imports": {
    "hono": "npm:hono@^4.0.0"
  }
}
```

---

### 6️⃣ LOGS DETALHADOS

**Para ver logs em tempo real:**

1. Acesse: https://app.supabase.com/project/nooknoilfqpfzujoddlp/functions/server/logs
2. Clique em **"Enable real-time logs"**
3. Faça uma requisição ao endpoint
4. Observe os logs que aparecem

**O que procurar:**

✅ **Requisição chegou:**
```
GET /make-server-9e4b8b7c/debug/env-vars
```

❌ **Erro de runtime:**
```
error: Cannot find module ...
error: Undefined variable ...
```

---

## 🔥 SOLUÇÃO RÁPIDA (RESET COMPLETO)

Se nada funcionar, faça um reset:

### Passo 1: Deletar e recriar secrets

1. Delete TODAS as secrets existentes
2. Recrie com os nomes CORRETOS (com espaços):

```
SUPABASE URL = https://nooknoilfqpfzujoddlp.supabase.co
SUPABASE ANON KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE SERVICE ROLE KEY = [PEGAR NO DASHBOARD]
APOLLO API KEY = 2MzD573PNPMUDo1kBRJUuA
```

### Passo 2: Forçar redeploy

```
Settings → Edge Functions → server → Redeploy
```

### Passo 3: Aguardar 1-2 minutos

O deploy pode demorar. Aguarde antes de testar.

### Passo 4: Testar novamente

```
https://nooknoilfqpfzujoddlp.supabase.co/functions/v1/make-server-9e4b8b7c/ping
```

---

## 🧪 CHECKLIST DE VERIFICAÇÃO

Antes de pedir ajuda, verifique:

- [ ] As 4 secrets estão configuradas COM ESPAÇOS (não underscores)
- [ ] Fiz redeploy da Edge Function após adicionar secrets
- [ ] Aguardei pelo menos 1 minuto após o redeploy
- [ ] Testei o endpoint /ping primeiro (mais simples)
- [ ] Verifiquei os logs da Edge Function
- [ ] Não há erros de sintaxe nos logs

---

## 📸 O QUE ENVIAR PARA DIAGNÓSTICO

Se o problema persistir, envie:

1. **Screenshot dos logs do servidor:**
   - Primeiras 50 linhas (mostra boot e diagnóstico)

2. **Screenshot da tela de Secrets:**
   - Mostrar os nomes das 4 secrets

3. **Resposta exata do erro:**
   - JSON completo do erro

---

## 🆘 ERRO ESPECÍFICO: "Requested function was not found"

Este erro específico geralmente significa:

### Causa #1: A Edge Function não existe ou não foi criada

**Verificar:**
```
Settings → Edge Functions → (procurar por "server")
```

Se não existir uma função chamada "server", você precisa criar:

1. Acesse Edge Functions
2. Create new function
3. Nome: `server`
4. Cola o código de `/supabase/functions/server/index.tsx`

### Causa #2: O nome da função está errado

A URL deve ser:
```
/functions/v1/make-server-9e4b8b7c/...
```

NÃO:
```
/functions/v1/server/...  ❌
/functions/v1/...         ❌
```

### Causa #3: Erro de import no Deno

O Deno não conseguiu importar alguma dependência.

**Solução:** Verifique o arquivo `deno.json` e garanta que tem:
```json
{
  "imports": {
    "hono": "npm:hono"
  }
}
```

---

## ✅ PRÓXIMOS PASSOS

1. **Primeiro:** Tente acessar `/ping` em vez de `/debug/env-vars`
2. **Verifique os logs** do Supabase para ver erros
3. **Faça redeploy** da Edge Function
4. **Aguarde 1-2 minutos** e teste novamente
5. **Se persistir:** Envie screenshots dos logs para diagnóstico

---

**Última atualização:** Dezembro 2024
