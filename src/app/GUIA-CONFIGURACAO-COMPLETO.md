# 🚀 Guia Completo de Configuração - APIs de Busca de Leads

## ⚠️ POR QUE AS BUSCAS NÃO FUNCIONAM?

### Status Atual:
- ✅ **Interface funciona perfeitamente**
- ❌ **APIs não estão configuradas** (chaves ausentes ou inválidas)
- ⚠️ **Sistema usa dados DEMO** como fallback

### O que você precisa fazer:
1. **Criar contas nas plataformas**
2. **Gerar API Keys**
3. **Configurar no Supabase**
4. **Testar as buscas**

---

## 1️⃣ APOLLO.IO - API de Dados B2B

### O que é?
Apollo.io é uma das maiores bases de dados B2B do mundo com **275+ milhões de contatos**. Ideal para buscar leads corporativos.

### ✅ Por que Apollo NÃO está funcionando?
**Resposta:** A API Key não está configurada ou é inválida.

Quando você vê este erro:
```
❌ APOLLO.IO RETORNOU ERRO!
Status: 401 Unauthorized
Erro: { "message": "Invalid access credentials." }
```

**Significa:** A chave API está faltando ou incorreta.

---

### 📋 Passo a Passo - Configurar Apollo.io

#### 1. Criar Conta Apollo.io
1. Acesse: https://app.apollo.io/
2. Clique em **"Sign Up"**
3. Preencha seus dados:
   - Nome completo
   - Email profissional
   - Senha forte
4. **Confirme seu email**

#### 2. Escolher Plano
Apollo tem 3 opções:

**Opção 1: FREE (Gratuito)** ✅ RECOMENDADO PARA COMEÇAR
- ✅ 50 créditos/mês
- ✅ Busca básica de contatos
- ✅ API access incluído
- ❌ Limitado a 50 leads/mês
- 💰 **€0/mês**

**Opção 2: Basic ($49/mês)**
- ✅ 1.200 créditos/mês
- ✅ Enriquecimento de dados
- ✅ Export ilimitado
- ✅ Sequências de email
- 💰 **$49/mês (~€45)**

**Opção 3: Professional ($99/mês)**
- ✅ 6.000 créditos/mês
- ✅ API avançada
- ✅ Integrações CRM
- ✅ Suporte prioritário
- 💰 **$99/mês (~€90)**

**👉 PARA TESTAR:** Comece com o plano FREE!

#### 3. Gerar API Key

1. **Login no Apollo:** https://app.apollo.io/
2. **Vá para Configurações:**
   - Clique no seu avatar (canto superior direito)
   - Clique em **"Settings"**
3. **Acesse API:**
   - No menu lateral, clique em **"API"** ou **"Integrations"**
   - Procure por **"API Keys"**
4. **Gerar Nova Key:**
   - Clique em **"Create New API Key"**
   - Dê um nome: **"LeadGen Pro"**
   - Clique em **"Generate"**
5. **COPIE A KEY:** 
   ```
   Exemplo: ap-1234567890abcdef1234567890abcdef
   ```
   ⚠️ **IMPORTANTE:** Guarde em local seguro! Ela só aparece UMA VEZ.

#### 4. Configurar no Supabase

1. **Acesse Supabase Dashboard:**
   - URL: https://supabase.com/dashboard
   - Login com sua conta

2. **Selecione seu Projeto:**
   - Clique no projeto do AI LeadGen Pro

3. **Vá para Environment Variables:**
   - Menu lateral → **"Settings"**
   - Clique em **"Edge Functions"**
   - Clique em **"Environment Variables"** ou **"Secrets"**

4. **Adicionar Nova Variável:**
   - Clique em **"Add Variable"** ou **"New Secret"**
   - **Name:** `APOLLO_API_KEY`
   - **Value:** Cole sua API key (ex: `ap-1234567890...`)
   - Clique em **"Save"** ou **"Add"**

5. **Restart das Functions:**
   - Algumas plataformas precisam reiniciar
   - Aguarde 30 segundos

#### 5. Testar Apollo

1. **Acesse a plataforma:** https://seu-dominio.com
2. **Faça login**
3. **Vá para:** Buscar Leads → Busca por Empresa
4. **Digite:**
   - Empresa: `Microsoft`
   - Cargo: `Sales Director`
   - Localização: `Lisboa`
5. **Clique em "Buscar"**

**✅ Se funcionar:** Verá leads REAIS da Microsoft
**❌ Se não funcionar:** Verifique os logs no Supabase

---

## 2️⃣ LINKEDIN API - Busca Profissional

### ⚠️ IMPORTANTE: LinkedIn API é MUITO RESTRITA

LinkedIn não oferece API pública para busca de leads. Apenas empresas parceiras têm acesso.

### Alternativas para LinkedIn:

#### Opção A: LinkedIn Sales Navigator (OFICIAL) 💰
**Custo:** €79,99/mês
**Benefícios:**
- ✅ Busca avançada ilimitada
- ✅ 50 InMails/mês
- ✅ Listas de leads
- ✅ Insights de contas
- ❌ **NÃO TEM API PÚBLICA**

**Link:** https://business.linkedin.com/sales-solutions/sales-navigator

**Como usar com nossa plataforma:**
1. Assine o Sales Navigator
2. Use para buscar leads manualmente
3. Exporte para Excel
4. Importe na nossa plataforma (função já implementada!)

#### Opção B: Apollo.io + LinkedIn (RECOMENDADO) ✅
Apollo busca dados públicos do LinkedIn:
- ✅ Nome, cargo, empresa
- ✅ Email corporativo (se disponível)
- ✅ Telefone (em alguns casos)
- ✅ Perfil do LinkedIn
- 💰 Já incluído na assinatura Apollo

#### Opção C: Ferramentas de Scraping (CUIDADO) ⚠️
**Não recomendamos** porque:
- ❌ Viola Termos de Serviço do LinkedIn
- ❌ Risco de ban permanente
- ❌ Problemas legais (GDPR)
- ❌ Dados imprecisos

---

## 3️⃣ OUTRAS APIs DISPONÍVEIS

### A. Hunter.io - Email Finder
**O que faz:** Encontra emails profissionais
**Preço:** €49/mês (ou 50 buscas grátis)
**Link:** https://hunter.io/

**Como configurar:**
1. Crie conta em https://hunter.io/
2. Vá para: Dashboard → API → API Keys
3. Copie sua API Key
4. No Supabase, adicione:
   - **Name:** `HUNTER_API_KEY`
   - **Value:** Sua key

### B. Clearbit - Enriquecimento de Dados
**O que faz:** Enriquece leads com informações da empresa
**Preço:** Sob consulta (plano enterprise)
**Link:** https://clearbit.com/

### C. RocketReach - Contatos Diretos
**O que faz:** Encontra telefones e emails diretos
**Preço:** €49-99/mês
**Link:** https://rocketreach.co/

---

## 4️⃣ RESUMO: O QUE FAZER AGORA?

### Prioridade 1: Apollo.io (OBRIGATÓRIO)
```
[ ] 1. Criar conta: https://app.apollo.io/
[ ] 2. Gerar API Key
[ ] 3. Configurar no Supabase (APOLLO_API_KEY)
[ ] 4. Testar busca na plataforma
```

### Prioridade 2: LinkedIn (OPCIONAL)
**Escolha uma opção:**
```
[ ] Opção A: Assinar Sales Navigator (€79,99/mês)
      + Buscar manualmente
      + Exportar e importar na plataforma

[ ] Opção B: Usar Apollo que já tem dados do LinkedIn
      (incluído se você configurou o passo 1)
```

### Prioridade 3: Extras (SE TIVER ORÇAMENTO)
```
[ ] Hunter.io - Para validar emails (€49/mês)
[ ] RocketReach - Para telefones (€49/mês)
```

---

## 5️⃣ CHECKLIST DE CONFIGURAÇÃO

### Fase 1: Setup Básico
- [ ] Supabase configurado e funcionando
- [ ] Conta Apollo.io criada
- [ ] API Key do Apollo gerada
- [ ] Variável APOLLO_API_KEY no Supabase
- [ ] Busca testada e funcionando

### Fase 2: Importação de Base
- [ ] Baixar template Excel da plataforma
- [ ] Preencher com leads existentes
- [ ] Fazer upload (Configurações → Dados)
- [ ] Validar importação

### Fase 3: Feedback Loop
- [ ] Marcar primeiros 5 leads com outcome
- [ ] Verificar Score de Qualidade
- [ ] Ajustar filtros baseado em resultados

---

## 6️⃣ PREÇOS TOTAIS (Estimativa)

### Setup Mínimo (GRÁTIS)
- ✅ Apollo.io Free: **€0/mês**
- ✅ Supabase: **€0/mês** (tier gratuito)
- ✅ Plataforma LeadGen: **€0/mês** (em desenvolvimento)
- **TOTAL: €0/mês** ✅

### Setup Profissional (Recomendado)
- ✅ Apollo.io Basic: **€45/mês**
- ✅ LinkedIn Sales Navigator: **€80/mês**
- ✅ Supabase Pro: **€25/mês**
- ✅ Plataforma LeadGen: **€99/mês** (preço sugerido)
- **TOTAL: €249/mês**

### Setup Enterprise (Máximo)
- ✅ Apollo.io Pro: **€90/mês**
- ✅ LinkedIn Sales Navigator: **€80/mês**
- ✅ Hunter.io: **€49/mês**
- ✅ RocketReach: **€49/mês**
- ✅ Supabase Pro: **€25/mês**
- **TOTAL: €293/mês** (sem a plataforma)

---

## 7️⃣ COMO VERIFICAR SE ESTÁ FUNCIONANDO?

### Teste 1: Apollo API
1. Abra o console do navegador (F12)
2. Vá para: Buscar Leads → Busca Avançada
3. Digite qualquer empresa
4. Observe o console:
   - ✅ **Se ver leads reais:** Funcionou!
   - ❌ **Se ver "dados DEMO":** Apollo não está configurado

### Teste 2: Logs do Supabase
1. Acesse: Supabase Dashboard
2. Vá para: Edge Functions → Logs
3. Procure por:
   ```
   ✅ "Apollo search successful"
   ❌ "401 Unauthorized"
   ```

### Teste 3: Diagnóstico da Plataforma
1. Login na plataforma
2. Vá para: Configurações → Segurança → Diagnóstico de APIs
3. Veja status de cada API:
   - 🟢 Verde = Funcionando
   - 🔴 Vermelho = Não configurada
   - 🟡 Amarelo = Créditos baixos

---

## 8️⃣ PERGUNTAS FREQUENTES

### "Posso usar a plataforma SEM Apollo?"
Sim! Mas apenas com:
- ✅ Importação manual de bases (Excel)
- ✅ Gestão de leads importados
- ❌ SEM busca automática

### "Apollo é obrigatório?"
Para **busca automática de leads**, SIM.
Para **gestão de base existente**, NÃO.

### "LinkedIn API é obrigatória?"
NÃO. Apollo já traz dados do LinkedIn.

### "Quanto custa no total?"
- **Mínimo:** €0/mês (Apollo Free + sem LinkedIn)
- **Ideal:** €125/mês (Apollo Basic + Sales Navigator)
- **Premium:** €250+/mês (tudo incluído)

### "Tem período de teste?"
- ✅ Apollo: Free tier permanente (50 leads/mês)
- ✅ Sales Navigator: 1 mês grátis (trial)
- ✅ Hunter.io: 50 buscas grátis

---

## 9️⃣ PRÓXIMOS PASSOS

### Hoje (30 minutos)
1. ✅ Criar conta Apollo.io (5 min)
2. ✅ Gerar API Key (2 min)
3. ✅ Configurar no Supabase (5 min)
4. ✅ Testar primeira busca (5 min)
5. ✅ Importar base existente se tiver (10 min)

### Esta Semana
1. Explorar Apollo dashboard
2. Refinar filtros de busca
3. Dar feedback nos primeiros 10 leads
4. Verificar Score de Qualidade da IA

### Próximo Mês
1. Avaliar upgrade para plano pago
2. Considerar LinkedIn Sales Navigator
3. Adicionar Hunter.io se precisar validar emails

---

## 🆘 PRECISA DE AJUDA?

### Suporte Apollo
- **Email:** support@apollo.io
- **Chat:** https://app.apollo.io (canto inferior direito)
- **Docs:** https://apolloio.github.io/apollo-api-docs/

### Suporte LinkedIn
- **Help Center:** https://www.linkedin.com/help/sales-navigator
- **Phone:** Disponível apenas para assinantes

### Suporte da Plataforma
- **Email:** suporte@leadgen.pt
- **WhatsApp:** +351 XXX XXX XXX
- **Chat:** Dentro da plataforma (canto inferior direito)

---

## ✅ CONCLUSÃO

### Para começar HOJE (grátis):
1. **Crie conta Apollo FREE** → 50 leads/mês grátis
2. **Configure no Supabase** → 5 minutos
3. **Faça sua primeira busca** → Funciona imediatamente!

### Para resultados profissionais:
1. **Upgrade Apollo Basic** → €45/mês = 1.200 leads
2. **Considere Sales Navigator** → €80/mês (opcional)
3. **Use sistema de feedback** → IA melhora sozinha

**Tempo total de setup:** 30-60 minutos
**Investimento inicial:** €0 (ou €45 para sério)
**Resultado:** Busca de leads funcionando 100%!

🚀 **Vamos configurar agora?**
