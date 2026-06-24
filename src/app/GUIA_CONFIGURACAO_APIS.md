# 🔑 GUIA COMPLETO - COMO OBTER LEADS REAIS (SEM DADOS DEMO)

## 🎯 **SITUAÇÃO ATUAL:**

Você está vendo **RESULTADOS DEMO/FAKE** porque:

```
❌ NENHUMA API ESTÁ CONFIGURADA
❌ Sistema entra em "DEMO MODE" automaticamente
❌ Retorna dados fictícios (mock data)
```

---

## ✅ **SOLUÇÃO: CONFIGURAR API KEYS**

Para obter **LEADS REAIS**, você precisa:

### **1️⃣ Criar contas nas plataformas**
### **2️⃣ Obter API keys**
### **3️⃣ Adicionar no Supabase**
### **4️⃣ Testar e validar**

---

## 🏢 **PLATAFORMAS DISPONÍVEIS:**

### **🔵 APOLLO.IO** (⭐ RECOMENDADA - Melhor custo-benefício)
- **O que faz:** Busca leads B2B (LinkedIn, empresas, emails)
- **Plano Grátis:** 50 créditos/mês
- **Plano Pago:** A partir de $49/mês (10.000 créditos)
- **Website:** https://www.apollo.io
- **Como obter:**
  1. Criar conta em https://www.apollo.io/sign-up
  2. Ir em Settings → Integrations → API
  3. Copiar a API key

**⚠️ IMPORTANTE:** Apollo é a mais completa para B2B e Real Estate!

---

### **🟢 HUNTER.IO** (Para encontrar emails)
- **O que faz:** Encontra emails de empresas/domínios
- **Plano Grátis:** 25 buscas/mês
- **Plano Pago:** A partir de $49/mês (500 buscas)
- **Website:** https://hunter.io
- **Como obter:**
  1. Criar conta em https://hunter.io/users/sign_up
  2. Dashboard → API → Generate API Key

**💡 USO:** Complementa Apollo para verificar emails

---

### **🟣 PEOPLEDATALABS (PDL)** (Para enriquecimento de dados)
- **O que faz:** Enriquece perfis com dados de múltiplas fontes
- **Plano Grátis:** 1.000 créditos de teste
- **Plano Pago:** A partir de $500/mês (10.000 créditos)
- **Website:** https://www.peopledatalabs.com
- **Como obter:**
  1. Criar conta em https://dashboard.peopledatalabs.com/signup
  2. Dashboard → API Keys → Create New Key

**⚠️ AVISO:** Mais caro, use apenas se precisar de dados ultra-detalhados

---

### **🔴 PROXYCURL** (LinkedIn scraping)
- **O que faz:** Extrai dados direto do LinkedIn
- **Plano Grátis:** 10 créditos de teste
- **Plano Pago:** Pay-as-you-go ($0.01 - $3 por perfil)
- **Website:** https://nubela.co/proxycurl
- **Como obter:**
  1. Criar conta em https://nubela.co/proxycurl/auth/signup
  2. Dashboard → API Credentials

**💰 PAY-AS-YOU-GO:** Só paga pelo que usar

---

### **🟠 ROCKETREACH** (Contatos + Redes Sociais)
- **O que faz:** Encontra emails, telefones e redes sociais
- **Plano Grátis:** 5 lookups/mês
- **Plano Pago:** A partir de $49/mês (170 lookups)
- **Website:** https://rocketreach.co
- **Como obter:**
  1. Criar conta em https://rocketreach.co/signup
  2. Settings → Integrations → API

---

### **🟡 CLEARBIT** (Enriquecimento de empresas)
- **O que faz:** Dados de empresas + perfis
- **Plano Grátis:** Não disponível
- **Plano Pago:** Customizado (contato com vendas)
- **Website:** https://clearbit.com

**⚠️ MAIS CARO:** Foque em Apollo + Hunter primeiro

---

### **🔵 LUSHA** (LinkedIn + Contatos)
- **O que faz:** Extrai contatos do LinkedIn
- **Plano Grátis:** 5 créditos/mês
- **Plano Pago:** A partir de $29/mês (100 créditos)
- **Website:** https://www.lusha.com

---

## 🎯 **RECOMENDAÇÃO POR ORÇAMENTO:**

### **💰 ORÇAMENTO ZERO (Grátis):**
```
1. Apollo.io (50 leads/mês) - GRÁTIS
2. Hunter.io (25 emails/mês) - GRÁTIS
3. Proxycurl (10 perfis teste) - GRÁTIS

TOTAL: ~85 leads/mês GRÁTIS
```

### **💵 ORÇAMENTO BAIXO ($49/mês):**
```
1. Apollo.io ($49/mês = 10.000 créditos) ⭐
   OU
2. Hunter.io ($49/mês = 500 buscas)

TOTAL: Até 10.000 leads/mês
```

### **💎 ORÇAMENTO MÉDIO ($100-200/mês):**
```
1. Apollo.io ($49/mês)
2. Hunter.io ($49/mês)
3. Proxycurl (pay-as-you-go, ~$50/mês)

TOTAL: 10.000+ leads/mês com emails verificados
```

### **🚀 ORÇAMENTO ALTO ($500+/mês):**
```
1. Apollo.io ($49/mês)
2. Hunter.io ($49/mês)
3. PeopleDataLabs ($500/mês)
4. RocketReach ($99/mês)
5. Proxycurl (pay-as-you-go)

TOTAL: 20.000+ leads/mês ultra-detalhados
```

---

## 📋 **PASSO A PASSO - CONFIGURAÇÃO NO SUPABASE:**

### **OPÇÃO 1: Via Dashboard Supabase (Recomendado)**

1. **Acesse o Supabase:**
   ```
   https://supabase.com/dashboard/project/[SEU-PROJECT-ID]
   ```

2. **Vá em Settings → Edge Functions:**
   ```
   Settings → Edge Functions → Secrets
   ```

3. **Adicione cada API Key:**
   ```
   Nome da Variável          |  Valor (sua API key)
   ─────────────────────────────────────────────────
   APOLLO_API_KEY           |  sk_xxxxxxxxxxxxxx
   HUNTER_API_KEY           |  xxxxxxxxxxxxxx
   PDL_API_KEY              |  xxxxxxxxxxxxxx
   PROXYCURL_API_KEY        |  xxxxxxxxxxxxxx
   ROCKETREACH_API_KEY      |  xxxxxxxxxxxxxx
   CLEARBIT_API_KEY         |  sk_xxxxxxxxxxxxxx
   LUSHA_API_KEY            |  xxxxxxxxxxxxxx
   ```

4. **Clique "Add Secret" para cada uma**

5. **Reinicie as Edge Functions:**
   ```
   Edge Functions → [sua função] → Restart
   ```

---

### **OPÇÃO 2: Via CLI Supabase**

```bash
# 1. Instalar Supabase CLI
npm install -g supabase

# 2. Fazer login
supabase login

# 3. Link ao projeto
supabase link --project-ref [SEU-PROJECT-ID]

# 4. Adicionar secrets (uma por vez)
supabase secrets set APOLLO_API_KEY=sk_xxxxxxxxxxxxxx
supabase secrets set HUNTER_API_KEY=xxxxxxxxxxxxxx
supabase secrets set PDL_API_KEY=xxxxxxxxxxxxxx
supabase secrets set PROXYCURL_API_KEY=xxxxxxxxxxxxxx

# 5. Ver secrets configuradas
supabase secrets list
```

---

## 🧪 **COMO TESTAR SE ESTÁ FUNCIONANDO:**

### **1. Via Interface (Mais fácil):**

```
1. Vá em "Buscar Leads"
2. Preencha APENAS:
   - Cargo: "CEO"
   - Indústria: "Real Estate"
3. Clique "Iniciar Busca"
4. Aguarde 10-30 segundos
5. Verifique a mensagem:

   ✅ FUNCIONOU: "X leads encontrados - Fontes: Apollo.io, Hunter.io"
   ❌ DEMO MODE: "X leads DEMO - Configure API keys em Configurações"
```

### **2. Via API (Para desenvolvedores):**

```bash
# Testar status das APIs
curl https://[PROJECT-ID].supabase.co/functions/v1/make-server-9e4b8b7c/search/test-apis \
  -H "Authorization: Bearer [ANON-KEY]"

# Retorno esperado:
{
  "apis": {
    "apollo": { "configured": true, "valid": true },
    "hunter": { "configured": true, "valid": true },
    ...
  },
  "summary": {
    "configured": 2,
    "valid": 2,
    "invalid": 0,
    "missing": 5
  }
}
```

---

## ⚠️ **PROBLEMAS COMUNS:**

### **1. "API key inválida"**
```
❌ CAUSA: Key copiada errada (espaços, incompleta)
✅ SOLUÇÃO: Copiar novamente direto do dashboard da API
```

### **2. "Ainda vejo dados DEMO"**
```
❌ CAUSA: Edge Functions não foram reiniciadas
✅ SOLUÇÃO: 
   1. Supabase Dashboard
   2. Edge Functions → Restart
   3. Aguardar 1-2 minutos
```

### **3. "403 Forbidden"**
```
❌ CAUSA: API key sem permissões ou expirada
✅ SOLUÇÃO: 
   1. Verificar plano da API (pode estar em trial expirado)
   2. Gerar nova API key
   3. Verificar se tem créditos restantes
```

### **4. "Apenas 1-2 resultados"**
```
❌ CAUSA: Filtros muito específicos
✅ SOLUÇÃO: 
   1. Remover alguns filtros
   2. Usar apenas Cargo OU Empresa (não ambos)
   3. Testar com "CEO" primeiro (sempre tem resultados)
```

### **5. "Rate limit exceeded"**
```
❌ CAUSA: Muitas buscas em pouco tempo
✅ SOLUÇÃO: 
   1. Aguardar 1 minuto
   2. Fazer buscas mais espaçadas
   3. Considerar upgrade de plano
```

---

## 💡 **DICAS DE OTIMIZAÇÃO:**

### **Para Máximo de Resultados GRÁTIS:**

```javascript
ESTRATÉGIA INTELIGENTE:

1. Apollo.io (50 créditos/mês)
   → Use para DESCOBRIR leads novos
   → Busque CEOs, Founders, Decision Makers
   
2. Hunter.io (25 buscas/mês)
   → Use para VERIFICAR emails dos leads do Apollo
   → Busque por domínio da empresa
   
3. Proxycurl (10 perfis/mês)
   → Use apenas para os TOP 10 leads mais promissores
   → Enriqueça com dados completos do LinkedIn

RESULTADO: 50 leads descobertos + 25 emails verificados + 10 ultra-detalhados
           = Pipeline de 50+ leads qualificados/mês SEM CUSTO!
```

### **Para Melhor Qualidade (Pago):**

```javascript
ESTRATÉGIA PREMIUM ($49/mês Apollo):

1. Apollo.io (10.000 créditos/mês)
   → Faça buscas amplas
   → Cargo: "CEO" OR "Founder" OR "Director"
   → Indústria: "Real Estate"
   → Localização: "Lisboa" OR "Porto" OR "Portugal"
   
2. Sistema filtra automaticamente:
   → Match Score > 80%
   → Apenas com email verificado
   → Apenas com LinkedIn ativo
   
RESULTADO: ~500-1000 leads altamente qualificados/mês
           Com apenas $49/mês!
```

---

## 📊 **COMPARAÇÃO CUSTO-BENEFÍCIO:**

| API            | Grátis/Mês | Custo Mínimo | Leads/$ | Recomendação      |
|----------------|------------|--------------|---------|-------------------|
| **Apollo.io**  | 50 leads   | $49 (10k)    | 204     | ⭐⭐⭐⭐⭐ MELHOR  |
| **Hunter.io**  | 25 emails  | $49 (500)    | 10      | ⭐⭐⭐⭐ BOM       |
| **Proxycurl**  | 10 perfis  | Pay-as-you-go| Variável| ⭐⭐⭐ OK          |
| **PDL**        | 1000 teste | $500 (10k)   | 20      | ⭐⭐ Caro          |
| **RocketReach**| 5 lookups  | $49 (170)    | 3.5     | ⭐⭐⭐ Médio       |

**VENCEDOR:** Apollo.io - 204 leads por dólar investido!

---

## 🎯 **RECOMENDAÇÃO FINAL:**

### **PARA COMEÇAR (Grátis):**
```
1. Cadastre no Apollo.io (grátis)
2. Obtenha API key
3. Configure no Supabase
4. Teste com busca de "CEO" em "Real Estate"
5. Você terá 50 leads REAIS/mês

CUSTO: $0
TEMPO: 10 minutos
```

### **PARA ESCALAR ($49/mês):**
```
1. Upgrade para Apollo Pro ($49/mês)
2. Configure a API key
3. Você terá 10.000 leads/mês

ROI: Se fechar 1 venda de imóvel = +1000% ROI!
```

---

## ✅ **CHECKLIST DE CONFIGURAÇÃO:**

- [ ] Criar conta Apollo.io
- [ ] Obter API key do Apollo
- [ ] Adicionar APOLLO_API_KEY no Supabase
- [ ] Reiniciar Edge Functions
- [ ] Testar busca de "CEO"
- [ ] Verificar que NÃO aparece "DEMO"
- [ ] Conferir fontes: "Apollo.io"

**Tempo total:** 10 minutos  
**Custo:** $0 (plano grátis)  
**Resultado:** Leads REAIS de verdade! 🎉

---

## 🆘 **PRECISA DE AJUDA?**

Se mesmo após seguir este guia você ainda vê dados DEMO:

1. **Verifique os logs:**
   ```
   Supabase Dashboard → Edge Functions → Logs
   Procure por: "🎭 [DEMO MODE]"
   ```

2. **Teste a API manualmente:**
   ```bash
   curl https://api.apollo.io/v1/auth/health \
     -H "Content-Type: application/json" \
     -d '{"api_key": "SUA-API-KEY-AQUI"}'
   ```

3. **Entre em contato:**
   - Email de suporte da API (Apollo, Hunter, etc)
   - Verifique se a trial não expirou
   - Confirme que tem créditos disponíveis

---

**🚀 PRONTO! Agora você sabe EXATAMENTE o que precisa fazer!**

**Comece com Apollo.io GRÁTIS hoje mesmo e tenha seus primeiros 50 leads REAIS!** ✨
