# 🔑 GUIA: ATUALIZAR APOLLO API KEY NO SUPABASE

## ⚠️ **PROBLEMA IDENTIFICADO:**

A busca está retornando dados **MOCKADOS/DEMO** porque a **Apollo API Key não está configurada** ou está desatualizada no Supabase.

**Nova chave fornecida:** `R31HOQYiof3eK9B5uxqePA`

---

## 📋 **PASSO A PASSO PARA ATUALIZAR:**

### **1. Acessar o Supabase Dashboard**

```
1. Ir para: https://supabase.com/dashboard
2. Fazer login na sua conta
3. Selecionar o projeto "ImobHunter"
```

---

### **2. Navegar até Edge Functions Secrets**

```
No menu lateral esquerdo:

1. Clicar em "Project Settings" (ícone de engrenagem)
2. Clicar em "Edge Functions"
3. Clicar na aba "Secrets"
```

**OU usar o caminho direto:**

```
https://supabase.com/dashboard/project/[SEU-PROJECT-ID]/settings/functions
```

---

### **3. Atualizar a APOLLO_API_KEY**

#### **OPÇÃO A: Se a variável JÁ EXISTE**

```
1. Procurar por "APOLLO_API_KEY" na lista
2. Clicar no botão "Edit" (lápis) ao lado
3. Colar o novo valor: R31HOQYiof3eK9B5uxqePA
4. Clicar em "Save" ou "Update"
```

#### **OPÇÃO B: Se a variável NÃO EXISTE**

```
1. Clicar no botão "+ Add new secret"
2. Name: APOLLO_API_KEY
3. Value: R31HOQYiof3eK9B5uxqePA
4. Clicar em "Save" ou "Create"
```

---

### **4. Reiniciar as Edge Functions**

Após atualizar a secret, você precisa **forçar o restart** das Edge Functions:

```
MÉTODO 1: Via Dashboard
1. Ir em "Edge Functions" (menu lateral)
2. Procurar a função "make-server-9e4b8b7c"
3. Clicar em "..." (três pontos)
4. Clicar em "Redeploy"

MÉTODO 2: Via CLI (se tiver instalado)
supabase functions deploy make-server-9e4b8b7c --no-verify-jwt
```

**⚠️ IMPORTANTE:**  
As variáveis de ambiente só são carregadas quando a função é deployada/redployada!

---

### **5. Verificar se Funcionou**

Depois de atualizar e redeployar:

```
1. Voltar para o ImobHunter
2. Ir em "Busca de Leads"
3. Fazer uma nova busca
4. Verificar se o banner "MODO DEMONSTRAÇÃO" desaparece
5. Conferir se os leads têm source: "apollo" em vez de "demo"
```

---

## 🧪 **TESTAR A API KEY (OPCIONAL)**

Você pode testar se a chave está válida ANTES de configurar no Supabase:

### **Teste via cURL (Terminal/Postman):**

```bash
curl -X POST https://api.apollo.io/v1/mixed_people/search \
  -H "Content-Type: application/json" \
  -H "Cache-Control: no-cache" \
  -d '{
    "api_key": "R31HOQYiof3eK9B5uxqePA",
    "page": 1,
    "per_page": 5,
    "person_titles": ["CEO"]
  }'
```

**RESPOSTA ESPERADA:**

```json
{
  "breadcrumbs": [...],
  "people": [
    {
      "id": "...",
      "first_name": "...",
      "last_name": "...",
      "name": "...",
      "linkedin_url": "...",
      "title": "CEO",
      "email": "...",
      ...
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 5,
    "total_entries": 1000000+
  }
}
```

**SE DER ERRO 401:**
```json
{
  "error": "Unauthorized",
  "message": "Invalid API key"
}
```
→ Significa que a chave está **INVÁLIDA** ou **EXPIRADA**

---

## 🔍 **OUTRAS API KEYS QUE VOCÊ PODE CONFIGURAR:**

Além do Apollo, você pode adicionar outras APIs para ter **mais fontes de dados**:

### **1. PeopleDataLabs (PDL)**
```
Nome: PDL_API_KEY
Valor: [SUA CHAVE]
Onde obter: https://dashboard.peopledatalabs.com/api-keys
```

### **2. Hunter.io**
```
Nome: HUNTER_API_KEY
Valor: [SUA CHAVE]
Onde obter: https://hunter.io/api-keys
```

### **3. RocketReach**
```
Nome: ROCKETREACH_API_KEY
Valor: [SUA CHAVE]
Onde obter: https://rocketreach.co/api
```

### **4. Proxycurl (LinkedIn)**
```
Nome: PROXYCURL_API_KEY
Valor: [SUA CHAVE]
Onde obter: https://nubela.co/proxycurl/
```

### **5. Clearbit**
```
Nome: CLEARBIT_API_KEY
Valor: [SUA CHAVE]
Onde obter: https://clearbit.com/
```

### **6. Lusha**
```
Nome: LUSHA_API_KEY
Valor: [SUA CHAVE]
Onde obter: https://www.lusha.com/api/
```

---

## ⚡ **QUANTO MAIS APIs, MELHORES OS RESULTADOS!**

O sistema tenta **todas as APIs configuradas** e combina os resultados:

```
┌─────────────────────────────────────────┐
│  BUSCA DE LEADS - MODO WATERFALL        │
├─────────────────────────────────────────┤
│                                         │
│  1. Tenta Apollo.io                     │
│     └─ Se funcionar: ✅ Adiciona        │
│     └─ Se falhar: ⚠️ Continua           │
│                                         │
│  2. Tenta PeopleDataLabs                │
│     └─ Se funcionar: ✅ Adiciona        │
│     └─ Se falhar: ⚠️ Continua           │
│                                         │
│  3. Tenta Hunter.io                     │
│     └─ Se funcionar: ✅ Adiciona        │
│     └─ Se falhar: ⚠️ Continua           │
│                                         │
│  4. Se TODAS falharam:                  │
│     └─ 🎭 Retorna dados DEMO/MOCK       │
│                                         │
└─────────────────────────────────────────┘
```

**Com 3 APIs configuradas, você terá:**
- ✅ Mais leads encontrados
- ✅ Dados mais completos (email, telefone, LinkedIn)
- ✅ Maior cobertura geográfica
- ✅ Menos dependência de uma única fonte

---

## 📊 **CHECKLIST DE CONFIGURAÇÃO:**

```
Status Atual:
[ ] APOLLO_API_KEY → R31HOQYiof3eK9B5uxqePA
[ ] PDL_API_KEY
[ ] HUNTER_API_KEY
[ ] ROCKETREACH_API_KEY
[ ] PROXYCURL_API_KEY
[ ] CLEARBIT_API_KEY
[ ] LUSHA_API_KEY

Próximos Passos:
[ ] 1. Atualizar APOLLO_API_KEY no Supabase
[ ] 2. Redeploy da Edge Function
[ ] 3. Testar busca no ImobHunter
[ ] 4. Verificar se dados DEMO desaparecem
[ ] 5. (Opcional) Adicionar outras APIs
```

---

## 🆘 **PROBLEMAS COMUNS:**

### **1. "A secret não aparece depois de salvar"**

**SOLUÇÃO:**
- Fazer logout e login novamente no Supabase
- Limpar cache do navegador
- Tentar em aba anônima

---

### **2. "Edge Function não reinicia"**

**SOLUÇÃO:**
```bash
# Via Supabase CLI (se tiver instalado):
supabase functions delete make-server-9e4b8b7c
supabase functions deploy make-server-9e4b8b7c --no-verify-jwt

# Ou via Dashboard:
1. Deletar a função
2. Fazer deploy novamente do código
```

---

### **3. "Ainda retorna dados DEMO depois de configurar"**

**DIAGNÓSTICO:**

1. Verificar se a secret foi salva:
   - Dashboard → Settings → Edge Functions → Secrets
   - Confirmar que `APOLLO_API_KEY` está na lista

2. Verificar os logs da Edge Function:
   - Dashboard → Edge Functions → make-server-9e4b8b7c → Logs
   - Procurar por: `APOLLO_API_KEY: undefined` ou `não configurado`

3. Testar o endpoint de diagnóstico:
   ```
   https://[PROJECT-ID].supabase.co/functions/v1/make-server-9e4b8b7c/search/test-apis
   ```
   - Deve retornar: `apollo.valid: true`

---

### **4. "A chave está configurada mas dá erro 401"**

**POSSÍVEIS CAUSAS:**

1. **Chave expirada:** Apollo API keys podem ter validade
   - Solução: Gerar nova key em https://app.apollo.io/settings/integrations

2. **Limite de créditos excedido:** Apollo tem quotas por plano
   - Solução: Verificar em https://app.apollo.io/settings/credits

3. **Chave copiada errada:** Espaços ou caracteres extras
   - Solução: Copiar novamente, sem espaços antes/depois

4. **IP bloqueado:** Apollo pode bloquear IPs suspeitos
   - Solução: Contatar suporte do Apollo

---

## 📞 **PRECISA DE AJUDA?**

### **Supabase Support:**
- Docs: https://supabase.com/docs/guides/functions/secrets
- Discord: https://discord.supabase.com

### **Apollo.io Support:**
- Docs: https://docs.apollo.io/
- Email: support@apollo.io
- Status: https://status.apollo.io/

---

## ✅ **DEPOIS DE CONFIGURAR:**

```
1. ✅ Busca retorna leads REAIS
2. ✅ Banner "MODO DEMO" desaparece
3. ✅ Source mostra "apollo" em vez de "demo"
4. ✅ Dados completos (email, phone, LinkedIn)
5. ✅ Match score mais preciso
```

---

**BOA SORTE! 🚀**

Se precisar de ajuda, me avise!
