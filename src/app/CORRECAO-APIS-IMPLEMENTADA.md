# ✅ Correção de APIs Implementada

## 🎯 Problema Identificado

Você estava a receber **dados fictícios (50 leads demo)** em vez de dados reais das APIs porque:

1. **❌ Rota `/admin/update-session` não existia** → Causava erro 404 nos logs
2. **❌ API keys não estavam a ser lidas corretamente** → Servidor retornava dados demo
3. **❌ Faltava diagnóstico adequado** → Difícil identificar o problema

## ✅ Correções Implementadas

### 1. **Rota `/admin/update-session` adicionada**
- ✅ Adicionada no servidor (`/supabase/functions/server/index.tsx`)
- ✅ Atualiza métricas de sessão do usuário
- ✅ Erro 404 **resolvido**

### 2. **Logs de Diagnóstico no Boot do Servidor**
Agora ao iniciar, o servidor mostra:
```
🔍 ═══════════════════════════════════════════════════════
🔍 DIAGNÓSTICO DE VARIÁVEIS DE AMBIENTE (API KEYS)
🔍 ═══════════════════════════════════════════════════════
   ✅ APOLLO_API_KEY: abc123def4... (40 chars)
   ✅ HUNTER_API_KEY: xyz789hij5... (35 chars)
   ❌ PDL_API_KEY: NÃO CONFIGURADA
   ...
```

### 3. **Endpoint de Teste de APIs**
- **URL:** `https://[PROJECT_ID].supabase.co/functions/v1/make-server-9e4b8b7c/diagnostics/test-apis-full`
- **Método:** GET
- **Testa:** Apollo.io, Hunter.io, RapidAPI (LinkedIn), etc.
- **Retorna:** Status de cada API com detalhes

### 4. **Painel de Diagnóstico Visual no Frontend**
- **Localização:** Configurações → Segurança → "Diagnóstico de API"
- **Funcionalidades:**
  - ✅ Mostra quais variáveis de ambiente estão configuradas
  - ✅ Testa chamadas reais às APIs
  - ✅ Exibe erros detalhados se algo falhar
  - ✅ Instruções de como configurar cada API

---

## 🔧 Como Configurar as API Keys

### **Passo 1: Aceder ao Supabase Dashboard**
```
https://supabase.com/dashboard/project/rwfymkhtucwkxdddmjqb
```

### **Passo 2: Ir para Edge Functions → Secrets**
1. No menu lateral, clique em **"Edge Functions"**
2. Clique em **"Secrets"** (ou "Environment Variables")

### **Passo 3: Adicionar as Variáveis**

#### 🔹 **APOLLO_API_KEY** (Recomendado - Mais Fácil)
- **Criar conta:** https://www.apollo.io/
- **Obter API Key:**
  1. Fazer login
  2. Ir em **Settings → API Keys**
  3. Copiar a key
- **Trial Grátis:** 50 créditos/mês
- **Nome da variável no Supabase:** `APOLLO_API_KEY`

#### 🔹 **HUNTER_API_KEY** (Para emails)
- **Criar conta:** https://hunter.io/
- **Obter API Key:**
  1. Fazer login
  2. Ir em **API → API Keys**
  3. Copiar a key
- **Trial Grátis:** 25 buscas/mês
- **Nome da variável no Supabase:** `HUNTER_API_KEY`

#### 🔹 **RAPIDAPI_KEY** (LinkedIn - Mais Fácil!)
- **Criar conta:** https://rapidapi.com/rockapis-rockapis-default/api/fresh-linkedin-profile-data
- **Obter API Key:**
  1. Fazer login
  2. Clicar em **"Subscribe to Test"**
  3. Escolher plano **"Basic (Free)"** → 100 requests/mês GRÁTIS
  4. Copiar a **"X-RapidAPI-Key"** do código de exemplo
- **Nome da variável no Supabase:** `RAPIDAPI_KEY`

#### 🔹 **LUSHA_API_KEY** (LinkedIn + Emails + Telefones)
- **Criar conta:** https://www.lusha.com/
- **Obter API Key:**
  1. Fazer login
  2. Ir em **Profile → API Access**
  3. Copiar a key
- **Trial Grátis:** 5 créditos
- **Nome da variável no Supabase:** `LUSHA_API_KEY`

#### 🔹 Outras APIs (Opcionais)
- `PDL_API_KEY` → https://www.peopledatalabs.com/ (Planos pagos)
- `ROCKETREACH_API_KEY` → https://rocketreach.co/ (Trial 7 dias)
- `PROXYCURL_API_KEY` → https://nubela.co/proxycurl/ (Trial grátis)

---

## 🧪 Como Testar as APIs

### **Opção 1: Painel Visual (Recomendado)**
1. Fazer login na plataforma
2. Ir em **⚙️ Configurações** (menu lateral)
3. Clicar na aba **"Segurança"**
4. Descer até **"Diagnóstico de API"**
5. Clicar em **"Executar Diagnóstico"**

✅ Verá:
- Quais API keys estão configuradas
- Se as APIs estão a responder
- Quantos resultados cada API retornou
- Erros detalhados (se houver)

### **Opção 2: Testar via API diretamente**
```bash
curl -X GET \
  "https://rwfymkhtucwkxdddmjqb.supabase.co/functions/v1/make-server-9e4b8b7c/diagnostics/test-apis-full" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3Znlta2h0dWN3a3hkZGRtanFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0NDk5NTgsImV4cCI6MjA1MDAyNTk1OH0.v8GDXJgDWi4lPZFr1MdWpPSa_RYJlPWR2_NMU30BzpU"
```

### **Opção 3: Verificar Logs do Servidor**
1. Ir em **Supabase Dashboard → Edge Functions**
2. Clicar em **"make-server-9e4b8b7c"**
3. Ver **"Logs"** ou **"Invocations"**
4. Procurar por:
   ```
   🔍 DIAGNÓSTICO DE VARIÁVEIS DE AMBIENTE
   ```

---

## 📊 Verificar se Está a Funcionar

### **Antes (❌ Dados Demo):**
```javascript
console.log('✅ Resposta recebida: { results: 50, ... }');
console.log('📊 Resumo dos resultados:');
console.log('   Total: 50');
console.log('   Com email: 50');  // ❌ TODOS têm email? Dados fictícios!
console.log('   Com telefone: 50');  // ❌ TODOS têm telefone? Dados fictícios!
```

### **Depois (✅ Dados Reais):**
```javascript
console.log('🔍 [1/7] Testando Apollo.io...');
console.log('   ✅ Apollo.io: 15 resultados');  // ✅ Número real de resultados
console.log('📡 Apollo.io: 15 resultados (REAIS)');
console.log('   📊 TODOS os 15 resultados retornados pelo Apollo:');
console.log('   1. John Smith - CEO @ TechCorp');  // ✅ Nomes reais!
console.log('   2. Maria Silva - CTO @ StartupXYZ');
```

---

## 🚨 Problemas Comuns

### **1. Ainda recebo dados fictícios**
**Causa:** API keys não configuradas ou inválidas

**Solução:**
1. Verificar no Supabase Dashboard → Edge Functions → Secrets
2. Confirmar que as variáveis estão lá (APOLLO_API_KEY, HUNTER_API_KEY, etc.)
3. Executar o diagnóstico na plataforma
4. Se aparecer "❌ NÃO CONFIGURADA", adicionar a key

### **2. Erro 401/403 nas APIs**
**Causa:** API key inválida ou expirada

**Solução:**
1. Ir no site da API (Apollo.io, Hunter.io, etc.)
2. Fazer login
3. Gerar uma **nova** API key
4. Substituir no Supabase
5. **Reiniciar as Edge Functions** (importante!)

### **3. Erro "API key não configurada" mas a key ESTÁ no Supabase**
**Causa:** Edge Functions não foram reiniciadas

**Solução:**
1. Supabase Dashboard → Edge Functions
2. Clicar nos **3 pontinhos** ao lado de "make-server-9e4b8b7c"
3. Clicar em **"Redeploy"** ou **"Restart"**
4. Aguardar 30-60 segundos
5. Testar novamente

### **4. Busca retorna 0 resultados**
**Causa:** Filtros muito restritivos ou API sem dados para esse perfil

**Solução:**
1. Começar com busca mais ampla (apenas cargo: "CEO")
2. Verificar se a API tem cobertura para o país/região (Apollo tem mais dados dos EUA)
3. Tentar buscar um perfil conhecido primeiro (exemplo: "Cleber Couto - CEO")

---

## 📝 Checklist de Verificação

- [ ] Variáveis de ambiente configuradas no Supabase
- [ ] Edge Functions reiniciadas após adicionar as keys
- [ ] Diagnóstico executado (verde = ✅)
- [ ] Logs do servidor mostram "✅ APOLLO_API_KEY: configurada"
- [ ] Busca real retorna dados com nomes diversos (não todos "Pedro Silva", "João Santos", etc.)
- [ ] Erro 404 do `/admin/update-session` **desapareceu**

---

## 🎯 Próximos Passos

1. **Configurar pelo menos APOLLO_API_KEY** (mais fácil e grátis)
2. **Executar diagnóstico** para confirmar
3. **Fazer busca de teste** (exemplo: "CEO" em "Technology")
4. **Verificar logs** para confirmar dados reais

---

## 💡 Dica Final

**Comece com Apollo.io!**
- ✅ Trial grátis (50 créditos)
- ✅ Mais fácil de configurar
- ✅ Cobertura global razoável
- ✅ Dados de qualidade

Depois, adicione Hunter.io (emails) e RapidAPI (LinkedIn) para enriquecer os dados.

---

## 🆘 Suporte

Se após seguir todos os passos ainda tiver problemas:

1. **Executar diagnóstico** e tirar screenshot
2. **Copiar logs do servidor** (Supabase → Edge Functions → Logs)
3. **Verificar console do navegador** (F12)
4. Partilhar essas informações para debug

---

**Data da correção:** 16 de Dezembro de 2024
**Versão do servidor:** 1.0.0
**Status:** ✅ Implementado e testado
