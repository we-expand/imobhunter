# 🔑 Guia de Configuração das API Keys

## ❓ Por que nada acontece ao clicar em "Iniciar Busca"?

O sistema está funcionando corretamente, mas **precisa de API keys configuradas** para buscar leads reais. Sem as API keys, o sistema:

✅ **FUNCIONA** - mas retorna apenas dados de demonstração (mock)
❌ **NÃO BUSCA LEADS REAIS** - porque as APIs externas não estão autenticadas

---

## 🎯 APIs Disponíveis para Busca de Leads

O sistema integra com **9 APIs profissionais** de enriquecimento de dados:

### **APIs Principais (Busca de Pessoas):**
1. **Apollo.io** - A melhor para buscar perfis B2B
2. **PeopleDataLabs (PDL)** - Base de dados massiva
3. **Hunter.io** - Especialista em encontrar emails

### **APIs Secundárias (Enriquecimento):**
4. **Proxycurl** - Dados do LinkedIn
5. **RocketReach** - Contatos e telefones
6. **Lusha** - Enriquecimento de contatos
7. **Clearbit** - Dados de empresas
8. **FullContact** - Perfis sociais
9. **Pipl** - Verificação de identidade

---

## 💰 Custos das APIs

### **APIs GRATUITAS (para teste):**
- ✅ **Apollo.io** - 50 créditos GRÁTIS/mês
- ✅ **Hunter.io** - 25 buscas GRÁTIS/mês  
- ✅ **PeopleDataLabs** - 1.000 créditos GRÁTIS no 1º mês

### **APIs PAGAS:**
- **RocketReach** - $49/mês (starter)
- **Proxycurl** - $0.01 por perfil LinkedIn
- **Lusha** - $29/mês (starter)
- **Clearbit** - $99/mês

---

## 🚀 Como Configurar (Passo a Passo)

### **OPÇÃO 1: Apollo.io (RECOMENDADO - 50 créditos grátis)**

#### **Passo 1: Criar conta grátis**
1. Acesse: https://app.apollo.io/sign-up
2. Crie uma conta gratuita (email + senha)
3. Confirme o email

#### **Passo 2: Obter API Key**
1. Faça login: https://app.apollo.io
2. Vá em **Settings** (ícone de engrenagem)
3. Clique em **Integrations** → **API Keys**
4. Clique em **"Create API Key"**
5. **COPIE A KEY** - ela começa com algo como `abc123def456...`

#### **Passo 3: Configurar no Supabase**
1. Acesse seu projeto Supabase: https://app.supabase.com
2. Vá em **Settings** (lateral esquerda) → **Edge Functions**
3. Clique na aba **"Secrets"** ou **"Environment Variables"**
4. Clique em **"New Secret"**
5. Preencha:
   - **Name:** `APOLLO_API_KEY`
   - **Value:** Cole a API key que você copiou
6. Clique em **"Save"** ou **"Create"**

#### **Passo 4: Reiniciar Edge Functions**
1. Ainda no Supabase, vá em **Edge Functions**
2. Encontre a função `make-server-9e4b8b7c`
3. Clique nos 3 pontinhos (...) → **"Redeploy"**
4. Aguarde 30 segundos para reiniciar

#### **Passo 5: Testar**
1. Volte para sua aplicação
2. Pressione **F12** → Aba **Console**
3. Clique em **"Iniciar Busca"**
4. Você deve ver no console:
   ```
   ✅ [APOLLO] API key válida!
   ✅ Apollo retornou X resultados
   ```

---

### **OPÇÃO 2: Hunter.io (25 buscas grátis/mês)**

#### **Passos:**
1. Crie conta em: https://hunter.io/users/sign_up
2. Vá em **API** → **API Keys**: https://hunter.io/api-keys
3. Clique em **"Create a new API Key"**
4. Copie a key (formato: `abc123...`)
5. No Supabase, crie a variável:
   - **Name:** `HUNTER_API_KEY`
   - **Value:** [sua key]
6. Reinicie as Edge Functions

---

### **OPÇÃO 3: PeopleDataLabs (1.000 créditos grátis)**

#### **Passos:**
1. Crie conta em: https://dashboard.peopledatalabs.com/signup
2. Vá em **API Keys**: https://dashboard.peopledatalabs.com/api-keys
3. Copie a **"Secret Key"**
4. No Supabase, crie a variável:
   - **Name:** `PDL_API_KEY`
   - **Value:** [sua key]
5. Reinicie as Edge Functions

---

## 🔍 Como Verificar se as APIs Estão Funcionando

### **Método 1: Console do Navegador (F12)**
1. Pressione **F12** no navegador
2. Vá na aba **Console**
3. Clique em **"Iniciar Busca"**
4. Procure por estas mensagens:

#### **✅ SE ESTIVER FUNCIONANDO:**
```
🔍 [PEOPLE SEARCH] Tentando Apollo.io...
✅ [PEOPLE SEARCH] Apollo retornou 15 resultados
📡 URL da API: https://xxx.supabase.co/functions/v1/make-server-9e4b8b7c/search/people
✅ 15 perfis REAIS encontrados!
Fontes: Apollo.io, Hunter.io
```

#### **❌ SE NÃO ESTIVER FUNCIONANDO:**
```
⚠️ [APOLLO] API key inválida ou expirada
🎭 [DEMO MODE] Nenhum resultado das APIs - Usando dados mock
⚠️ 10 perfis DEMO encontrados
```

### **Método 2: Endpoint de Teste**
1. Abra o console (F12)
2. Cole e execute este código:
```javascript
fetch('https://SEU_PROJECT_ID.supabase.co/functions/v1/make-server-9e4b8b7c/search/test-apis')
  .then(r => r.json())
  .then(data => console.log('🧪 Status das APIs:', data));
```

3. Você verá:
```json
{
  "apis": {
    "apollo": {
      "configured": true,
      "valid": true,  // ✅ Deve ser TRUE
      "keyLength": 40
    },
    "hunter": {
      "configured": false,  // ❌ Não configurado
      "valid": false
    }
  },
  "summary": {
    "total": 7,
    "configured": 1,  // Quantas você configurou
    "valid": 1,       // Quantas estão funcionando
    "invalid": 0,
    "missing": 6
  }
}
```

---

## ⚙️ Variáveis de Ambiente Necessárias

Copie e cole estas variáveis no Supabase (Settings → Edge Functions → Secrets):

```bash
# APIs de Busca de Leads (pelo menos 1 necessária)
APOLLO_API_KEY=        # Obtenha em: https://app.apollo.io/settings/integrations
HUNTER_API_KEY=        # Obtenha em: https://hunter.io/api-keys
PDL_API_KEY=           # Obtenha em: https://dashboard.peopledatalabs.com/api-keys

# APIs de Enriquecimento (opcionais)
PROXYCURL_API_KEY=     # Obtenha em: https://nubela.co/proxycurl/dashboard
ROCKETREACH_API_KEY=   # Obtenha em: https://rocketreach.co/api
LUSHA_API_KEY=         # Obtenha em: https://www.lusha.com/api/
CLEARBIT_API_KEY=      # Obtenha em: https://dashboard.clearbit.com/api

# APIs de Email (opcional - para notificações)
RESEND_API_KEY=        # Obtenha em: https://resend.com/api-keys

# Variáveis do Supabase (JÁ CONFIGURADAS)
SUPABASE_URL=          # Já existe
SUPABASE_ANON_KEY=     # Já existe
SUPABASE_SERVICE_ROLE_KEY=  # Já existe
```

---

## 🆘 Problemas Comuns

### **1. "Clico em Iniciar Busca mas nada acontece"**
**Causa:** Nenhuma API key configurada
**Solução:** Configure pelo menos a Apollo.io (50 créditos grátis)

### **2. "Retorna apenas dados DEMO"**
**Causa:** API keys inválidas ou não configuradas
**Solução:** Verifique se:
- A key foi copiada corretamente (sem espaços extras)
- A variável tem o nome EXATO (ex: `APOLLO_API_KEY`)
- As Edge Functions foram reiniciadas após adicionar a key

### **3. "Apollo API key inválida"**
**Causa:** Key expirada ou incorreta
**Solução:**
1. Vá em Apollo.io → Settings → Integrations → API Keys
2. Delete a key antiga
3. Crie uma nova
4. Atualize no Supabase
5. Reinicie as Edge Functions

### **4. "Status 401 Unauthorized"**
**Causa:** API key não foi reconhecida pelo serviço
**Solução:**
- Apollo.io: A key vai no **body** da requisição (já implementado)
- Hunter.io: A key vai na **URL** (já implementado)
- PDL: A key vai no **header X-Api-Key** (já implementado)

### **5. "Todas as APIs falharam"**
**Causa:** Problema de rede ou keys inválidas
**Solução:**
1. Abra F12 → Console
2. Veja os logs de erro
3. Teste a key diretamente na plataforma da API
4. Se funcionar lá, o problema é na configuração do Supabase

---

## 📊 Como o Sistema Funciona

### **Fluxo de Busca:**
1. **Usuário clica em "Iniciar Busca"**
2. Frontend envia requisição para: `/search/people`
3. **Servidor tenta buscar em ordem:**
   - 🔵 Apollo.io (melhor cobertura B2B)
   - 🟢 PeopleDataLabs (base massiva)
   - 🟡 Hunter.io (especialista em emails)
4. **Combina todos os resultados**
5. **Remove duplicados**
6. **Retorna para o usuário**

### **Modo DEMO (Fallback):**
Se TODAS as APIs falharem, o sistema:
- ✅ Continua funcionando
- 🎭 Retorna dados mock para demonstração
- ⚠️ Exibe aviso: "Configure API keys para buscar leads reais"

---

## 💡 Recomendações

### **Para Começar (Grátis):**
1. **Apollo.io** - 50 créditos/mês grátis ✅
2. **Hunter.io** - 25 buscas/mês grátis ✅

### **Para Produção (Pago):**
1. **Apollo.io** - Plano Pro: $49/mês (1.200 créditos)
2. **PeopleDataLabs** - Pay-as-you-go: $0.01 por registro
3. **Hunter.io** - Plano Starter: $49/mês (500 buscas)

### **Para Máxima Cobertura:**
Configure as 3 principais (Apollo + PDL + Hunter) = **Cobertura de ~80% dos perfis B2B globais**

---

## 🎯 Próximos Passos

1. **Configure pelo menos 1 API** (recomendo Apollo.io - grátis)
2. **Teste a busca** no console (F12)
3. **Verifique os logs** para confirmar que está funcionando
4. **Se funcionar:** Você verá "✅ X perfis REAIS encontrados!"
5. **Se não funcionar:** Me mostre os logs do console para eu ajudar

---

## 📞 Suporte

Se ainda não funcionar após configurar:
1. Pressione **F12** → **Console**
2. Clique em "Iniciar Busca"
3. **Copie TODOS os logs** que aparecem
4. Me envie para eu diagnosticar o problema

**Logs importantes a procurar:**
- `🔍 [PEOPLE SEARCH] Recebendo requisição`
- `📤 Apollo payload:`
- `📥 Apollo response status:`
- `✅ Apollo retornou X resultados` ou `❌ Apollo falhou`

---

**✨ Boa sorte! Com apenas 1 API configurada (Apollo.io grátis) você já consegue buscar leads reais!**
