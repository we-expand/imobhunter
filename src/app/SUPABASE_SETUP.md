# 🚀 CONFIGURAÇÃO DAS API KEYS NO SUPABASE

## ✅ PROBLEMA DE CORS RESOLVIDO!

O sistema ImobHunter agora usa **Edge Functions do Supabase** como proxy server-side para fazer as chamadas às APIs Apollo.io e Proxycurl, resolvendo completamente o problema de CORS.

## ⚠️ **ATENÇÃO: VOCÊ PRECISA FAZER O DEPLOY DAS EDGE FUNCTIONS!**

**As Edge Functions NÃO estão deployadas automaticamente!** Você precisa fazer o deploy manualmente seguindo os passos abaixo.

---

## 📝 PASSO A PASSO

### 1️⃣ Acesse o Supabase Dashboard

1. Vá para: https://supabase.com/dashboard
2. Faça login na sua conta
3. Selecione o projeto: **bgarakvnuppzkugzptsr**

### 2️⃣ Configure as Variáveis de Ambiente (API Keys)

1. No menu lateral, clique em **Settings** (⚙️ ícone de engrenagem)
2. Clique em **Edge Functions**
3. Role até a seção **Environment variables**
4. Adicione as seguintes variáveis:

#### **APOLLO_API_KEY**
```
Nome: APOLLO_API_KEY
Valor: 2MzD573PNPMUDo1kBRJUuA
```

#### **PROXYCURL_API_KEY**
```
Nome: PROXYCURL_API_KEY
Valor: b959e024b59143eea04eae0d296beebb
```

5. Clique em **Save** ou **Add** para cada variável

---

## 🔄 3️⃣ Deploy das Edge Functions

Após configurar as variáveis de ambiente, você precisa fazer deploy das Edge Functions:

### Opção A: Deploy via CLI (Recomendado)

```bash
# 1. Instalar Supabase CLI (se não tiver)
npm install -g supabase

# 2. Login no Supabase
supabase login

# 3. Link com seu projeto
supabase link --project-ref bgarakvnuppzkugzptsr

# 4. Deploy da função
supabase functions deploy make-server-9e4b8b7c
```

### Opção B: Deploy via Dashboard (Alternativa)

1. No Supabase Dashboard, vá em **Edge Functions**
2. Clique em **Deploy new function**
3. Cole o código do arquivo `/supabase/functions/server/index.tsx`
4. Nomeie como `make-server-9e4b8b7c`
5. Clique em **Deploy**

---

## ✅ 4️⃣ Verificar se funcionou

Após o deploy, teste a função acessando:

```
https://bgarakvnuppzkugzptsr.supabase.co/functions/v1/make-server-9e4b8b7c/api-proxy/status
```

Você deve ver uma resposta JSON como:

```json
{
  "status": "online",
  "timestamp": "2026-01-26T...",
  "apis": {
    "apollo": {
      "configured": true,
      "endpoint": "/api-proxy/apollo/search"
    },
    "proxycurl": {
      "configured": true,
      "endpoints": {
        "search": "/api-proxy/proxycurl/search",
        "profile": "/api-proxy/proxycurl/profile"
      }
    }
  },
  "message": "✅ Todas as APIs configuradas"
}
```

---

## 🎯 COMO FUNCIONA

### Fluxo ANTES (com erro de CORS):

```
Frontend → ❌ BLOCKED (CORS) → Apollo.io API
Frontend → ❌ BLOCKED (CORS) → Proxycurl API
```

### Fluxo AGORA (funcionando):

```
Frontend → ✅ Supabase Proxy → Apollo.io API
Frontend → ✅ Supabase Proxy → Proxycurl API
```

### Endpoints Disponíveis:

1. **Apollo Search**:
   - `POST /make-server-9e4b8b7c/api-proxy/apollo/search`
   
2. **Proxycurl Search**:
   - `GET /make-server-9e4b8b7c/api-proxy/proxycurl/search`
   
3. **Proxycurl Profile**:
   - `GET /make-server-9e4b8b7c/api-proxy/proxycurl/profile`
   
4. **Status Check**:
   - `GET /make-server-9e4b8b7c/api-proxy/status`

---

## 🔒 SEGURANÇA

✅ **As API keys ficam APENAS no servidor** (Supabase Edge Functions)
✅ **Frontend nunca expõe as chaves** (apenas envia Authorization com anon key pública)
✅ **CORS resolvido** (servidor faz as chamadas, não o browser)

---

## 🐛 TROUBLESHOOTING

### Problema: "API key não configurada"

**Solução**: Verifique se adicionou as variáveis de ambiente no Supabase Dashboard:
- APOLLO_API_KEY
- PROXYCURL_API_KEY

### Problema: "Function not found"

**Solução**: Faça o deploy da Edge Function:
```bash
supabase functions deploy make-server-9e4b8b7c
```

### Problema: Ainda retorna dados mockados

**Solução**: 
1. Verifique se o deploy foi feito com sucesso
2. Teste o endpoint `/api-proxy/status` para confirmar que as APIs estão configuradas
3. Abra o Console do navegador e veja os logs detalhados da busca

---

## 📚 DOCUMENTAÇÃO DAS APIS

### Apollo.io
- Documentação: https://apolloio.github.io/apollo-api-docs/
- Limite: Varia conforme plano (verifique no dashboard Apollo)

### Proxycurl
- Documentação: https://nubela.co/proxycurl/docs
- Limite: Baseado em créditos (10 créditos = 1 profile search)

---

## ✨ PRÓXIMOS PASSOS

Após configurar tudo:

1. ✅ Acesse o sistema ImobHunter
2. ✅ Faça uma busca na ferramenta "Data Mining"
3. ✅ Os dados REAIS de Apollo e LinkedIn aparecerão!
4. ✅ Sistema de conflation/merge IA mesclará automaticamente os dados

**PRONTO! Seu sistema agora funciona com DADOS REAIS! 🎉**