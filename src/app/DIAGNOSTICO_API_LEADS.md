# 🔍 DIAGNÓSTICO: POR QUE NÃO BUSCA LEADS REAIS?

## ✅ **STATUS ATUAL:**

### **O que ESTÁ funcionando:**
- ✅ API `imobhunter-api` está **VIVA** (ping retorna 200 OK)
- ✅ Rotas estão corretas
- ✅ Frontend chama a API corretamente
- ✅ Autenticação funciona

### **O que NÃO está funcionando:**
- ❌ **Busca retorna dados DEMO** em vez de dados REAIS
- ❌ API não está buscando dados das fontes externas

---

## 🎯 **CAUSA RAIZ:**

A API `imobhunter-api` está **provavelmente retornando dados DEMO** porque:

### **Opção 1: API Keys não configuradas**
As variáveis de ambiente no Supabase não estão configuradas ou estão incorretas:
- `APOLLO_API_KEY`
- `HUNTER_API_KEY`
- `PDL_API_KEY`
- `CLEARBIT_API_KEY`
- `ROCKETREACH_API_KEY`
- `LUSHA_API_KEY`
- `FULLCONTACT_API_KEY`
- `PROXYCURL_API_KEY`
- `RAPIDAPI_KEY`

### **Opção 2: Lógica de Fallback**
A função `imobhunter-api` pode ter uma lógica de fallback que:
1. Tenta buscar dados reais
2. Se falhar, retorna dados demo
3. Não está logando o motivo da falha

---

## 🧪 **TESTE IMEDIATO:**

### **Passo 1: Teste o novo componente**
1. Abra a aplicação
2. No canto inferior direito, você verá **3 cards flutuantes:**
   - 🧪 **Teste rápido do Apollo** (vermelho)
   - 🔍 **Debug Info** (azul)
   - 🧪 **Teste de API de Leads** (NOVO - verde)

3. **Clique em "▶️ Testar API de Leads"** no card verde

### **Passo 2: Verifique o console**
Abra o Console do navegador (F12) e procure por:

```
🧪 TESTE DA API DE LEADS
📤 PAYLOAD: ...
✅ RESPOSTA RECEBIDA:
   - sources: ???
```

### **Passo 3: Analise a resposta**

#### **Se mostrar `sources: ['demo']`:**
```
⚠️ DADOS DE DEMONSTRAÇÃO!
💡 A API está retornando dados DEMO.
```
**→ PROBLEMA: API keys não estão configuradas ou inválidas**

#### **Se mostrar `sources: ['apollo', 'hunter', ...]`:**
```
✅ DADOS REAIS RECEBIDOS!
✅ Fontes: apollo, hunter, pdl
```
**→ SUCESSO! Está funcionando corretamente**

---

## 🔧 **SOLUÇÕES:**

### **Solução 1: Verificar `/diagnostics`**

A rota `/imobhunter-api/diagnostics` deve retornar o status das API keys.

**Como testar:**
1. Abra o card "Debug Info"
2. Procure por "imobhunter-api (diagnostics)"
3. Veja o JSON retornado

**Deve mostrar algo como:**
```json
{
  "status": "healthy",
  "apis": {
    "apollo": {
      "configured": true,
      "valid": true
    },
    "hunter": {
      "configured": true,
      "valid": false,
      "error": "Invalid API key"
    },
    ...
  }
}
```

### **Solução 2: Reconfigurar API Keys no Supabase**

1. Acesse o **Supabase Dashboard**
2. Vá em **Settings → Edge Functions → Secrets**
3. Verifique se TODAS as keys estão configuradas:

```bash
APOLLO_API_KEY=sua_key_real
HUNTER_API_KEY=sua_key_real
PDL_API_KEY=sua_key_real
CLEARBIT_API_KEY=sua_key_real
ROCKETREACH_API_KEY=sua_key_real
LUSHA_API_KEY=sua_key_real
FULLCONTACT_API_KEY=sua_key_real
PROXYCURL_API_KEY=sua_key_real
RAPIDAPI_KEY=sua_key_real
LINKEDIN_API_KEY=sua_key_real
```

4. **Importante:** Após alterar, você deve **redeploy** a edge function:
```bash
# Via CLI do Supabase
supabase functions deploy imobhunter-api
```

### **Solução 3: Verificar Logs da Edge Function**

No Supabase Dashboard:
1. Vá em **Edge Functions → imobhunter-api**
2. Clique em **Logs**
3. Faça uma busca de leads
4. Veja o que aparece nos logs

**Procure por:**
- ❌ Erros de autenticação nas APIs
- ❌ Erros de rate limit
- ❌ Erros de parsing
- ❌ Timeouts

---

## 📊 **FLUXO DE DIAGNÓSTICO:**

```
1. Testar `/diagnostics`
   ├─ Se retornar 404 → API não tem rota de diagnóstico
   └─ Se retornar 200 → Ver status das keys

2. Verificar status das API keys
   ├─ Se `configured: false` → Key não foi configurada
   ├─ Se `valid: false` → Key é inválida
   └─ Se `valid: true` → Key OK, problema é em outro lugar

3. Testar busca de leads
   ├─ Se retornar `sources: ['demo']` → Fallback ativo
   └─ Se retornar `sources: ['apollo', ...]` → SUCESSO!

4. Ver logs da Edge Function
   ├─ Ver erros específicos
   └─ Identificar causa raiz
```

---

## 🚨 **PROBLEMA MAIS PROVÁVEL:**

### **API Keys não configuradas ou expiradas**

**Por quê?**
- Você mencionou que as keys estão configuradas, mas a busca não retorna dados reais
- Isso sugere que as keys podem estar:
  - ❌ Incorretas
  - ❌ Expiradas
  - ❌ Sem créditos
  - ❌ Com rate limit atingido

**Como confirmar:**
1. Teste cada API key manualmente usando cURL ou Postman
2. Verifique se as keys têm créditos disponíveis
3. Confirme que não há rate limiting

---

## ✅ **CHECKLIST DE VALIDAÇÃO:**

- [ ] Testei o componente "Teste de API de Leads"
- [ ] Verifiquei o console do navegador
- [ ] Vi a resposta da API (DEMO ou REAL?)
- [ ] Testei `/diagnostics` para ver status das keys
- [ ] Confirmei que as keys estão configuradas no Supabase
- [ ] Verifiquei os logs da Edge Function
- [ ] Testei uma key manualmente (ex: Apollo API)

---

## 🎯 **PRÓXIMO PASSO:**

**AGORA:**
1. ✅ **Teste o componente verde** ("Teste de API de Leads")
2. ✅ **Copie a resposta JSON** que aparecer
3. ✅ **Me envie** para eu ver o que está retornando

**Exemplo do que eu preciso ver:**
```json
{
  "success": true,
  "results": [...],
  "sources": ["demo"],  ← ISSO É O MAIS IMPORTANTE
  "message": "Razão do fallback aqui",
  "_meta": {
    "status": 200,
    "duration": "123ms"
  }
}
```

---

## 📞 **ME ENVIE:**

1. **Resposta do teste de leads** (JSON completo)
2. **Resposta do `/diagnostics`** (JSON completo)
3. **Logs do console** quando você faz a busca
4. **Prints dos logs** da Edge Function no Supabase (se possível)

Com essas informações, posso te dizer **exatamente** o que está errado! 🎯

---

**Status:** ⏳ Aguardando testes
**Data:** 17 de Dezembro de 2024
