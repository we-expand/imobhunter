# 🔍 Como Configurar o Enriquecimento de Dados

## ⚠️ IMPORTANTE: API Keys Necessárias

O sistema de enriquecimento de dados busca informações **REAIS** da internet usando **8 APIs profissionais**. Para que o enriquecimento funcione, você precisa configurar as API keys no **Supabase**.

---

## 📋 APIs Usadas (8 fontes)

### 1. **Hunter.io** ✅ ESSENCIAL
- **O que faz:** Verifica se o email é válido e busca emails da empresa
- **Preço:** 25 verificações/mês GRÁTIS
- **Como obter:**
  1. Acesse: https://hunter.io
  2. Crie uma conta gratuita
  3. Vá em: `API` → `API Keys`
  4. Copie a key

### 2. **Apollo.io** ✅ ESSENCIAL
- **O que faz:** Dados profissionais completos (cargo, empresa, telefones, redes sociais)
- **Preço:** 60 créditos/mês GRÁTIS
- **Como obter:**
  1. Acesse: https://apollo.io
  2. Crie uma conta
  3. Vá em: `Settings` → `API Keys`
  4. Copie a key

### 3. **Clearbit** (Opcional)
- **O que faz:** Perfil social, bio, dados da empresa, tech stack
- **Preço:** Apenas plano pago/trial
- **Como obter:** https://clearbit.com

### 4. **People Data Labs (PDL)** ✅ RECOMENDADO
- **O que faz:** Histórico profissional completo, educação, habilidades
- **Preço:** 1,000 créditos GRÁTIS
- **Como obter:**
  1. Acesse: https://peopledatalabs.com
  2. Crie conta
  3. Vá em: `API Keys`
  4. Copie a key

### 5. **FullContact** (Opcional)
- **O que faz:** Perfil social completo (Instagram, YouTube, etc)
- **Preço:** 100 enrichments/mês GRÁTIS
- **Como obter:** https://fullcontact.com

### 6. **RocketReach** (Opcional)
- **O que faz:** Telefones diretos e emails alternativos
- **Preço:** 5 lookups/mês GRÁTIS
- **Como obter:** https://rocketreach.co

### 7. **Pipl** (Opcional)
- **O que faz:** Busca profunda em registros públicos
- **Preço:** Apenas Enterprise
- **Como obter:** https://pipl.com

### 8. **Busca Inteligente** ✅ SEMPRE ATIVO
- **O que faz:** Gera URLs de busca automática (LinkedIn, Google)
- **Preço:** GRÁTIS (não usa API)

---

## 🚀 Como Configurar as API Keys

### Passo 1: Obter as API Keys
1. Crie contas nos serviços acima (comece com Hunter.io e Apollo.io)
2. Copie as API keys de cada um

### Passo 2: Configurar no Supabase

1. **Acesse o Supabase Dashboard:**
   - URL: https://supabase.com/dashboard
   - Entre no seu projeto

2. **Vá em:**
   ```
   Project Settings → Edge Functions → Secrets
   ```

3. **Adicione cada API key:**

   | Nome da Variável      | Valor                    | Obrigatória? |
   |-----------------------|--------------------------|--------------|
   | `HUNTER_API_KEY`      | Sua key do Hunter.io     | ✅ SIM       |
   | `APOLLO_API_KEY`      | Sua key do Apollo.io     | ✅ SIM       |
   | `CLEARBIT_API_KEY`    | Sua key do Clearbit      | ⚠️ Opcional  |
   | `PDL_API_KEY`         | Sua key do PDL           | 🟢 Recomendado |
   | `FULLCONTACT_API_KEY` | Sua key do FullContact   | ⚠️ Opcional  |
   | `ROCKETREACH_API_KEY` | Sua key do RocketReach   | ⚠️ Opcional  |
   | `PIPL_API_KEY`        | Sua key do Pipl          | ⚠️ Opcional  |

4. **Clique em "Save" após adicionar cada uma**

### Passo 3: Testar o Enriquecimento

1. Faça login como admin:
   - Email: `admin@kwportugal.com`
   - Senha: `admin123`

2. Vá para o **Admin Dashboard**

3. Clique em qualquer usuário da lista

4. O sistema vai:
   - ✅ Abrir um modal
   - ✅ Mostrar "🔍 Buscando dados em 8 fontes..."
   - ✅ Coletar dados das APIs configuradas
   - ✅ Exibir os resultados enriquecidos

---

## 📊 O Que Será Coletado

### Se TODAS as APIs estiverem configuradas:

**Informações Pessoais:**
- ✅ Nome completo
- ✅ Foto/Avatar
- ✅ Bio profissional
- ✅ Localização (cidade, país, fuso horário)

**Informações Profissionais:**
- ✅ Cargo atual
- ✅ Senioridade (Junior, Senior, Manager, C-Level)
- ✅ Empresa atual (nome, logo, website, descrição)
- ✅ Indústria da empresa
- ✅ Número de funcionários
- ✅ Receita anual estimada
- ✅ Tech stack da empresa
- ✅ Histórico de trabalho (últimos 5 empregos)
- ✅ Formação acadêmica
- ✅ Habilidades técnicas

**Contatos:**
- ✅ Email verificado (com score de 0-100)
- ✅ Emails alternativos
- ✅ Telefones celulares e fixos
- ✅ Status do WhatsApp (ativo/inativo)

**Redes Sociais:**
- ✅ LinkedIn
- ✅ Twitter/X
- ✅ Facebook
- ✅ GitHub
- ✅ Instagram
- ✅ YouTube
- ✅ URLs de busca inteligente

**Métricas de Enriquecimento:**
- ✅ Completude dos dados (0-100%)
- ✅ Qualidade dos dados (0-100%)
- ✅ Score de enriquecimento (0-100%)
- ✅ Número de fontes utilizadas (X/8)
- ✅ Lista de APIs que retornaram dados

---

## ⚡ Configuração Rápida (Mínimo Recomendado)

Se você quer começar rápido, configure **APENAS** estas 3 APIs:

1. **Hunter.io** (essencial para verificar emails)
2. **Apollo.io** (melhor custo-benefício para dados B2B)
3. **People Data Labs** (1,000 créditos grátis)

Com essas 3, você já terá:
- ✅ Email verificado
- ✅ Cargo e empresa
- ✅ Telefones
- ✅ Redes sociais (LinkedIn, Twitter, Facebook)
- ✅ Histórico profissional
- ✅ Formação acadêmica
- ✅ Habilidades

---

## 🐛 Troubleshooting

### "❌ Erro ao coletar dados"
**Causa:** API keys não configuradas ou inválidas
**Solução:** 
1. Verifique se as keys estão no Supabase (Project Settings → Edge Functions → Secrets)
2. Confirme que as keys não expiraram
3. Teste as keys manualmente nas plataformas

### "Score de enriquecimento: 0%"
**Causa:** Nenhuma API retornou dados
**Solução:**
1. Configure pelo menos Hunter.io e Apollo.io
2. Verifique se o usuário tem email válido
3. Tente com um email corporativo (não Gmail/Hotmail)

### "Completude: 12%"
**Causa:** Usuário não tem presença online suficiente
**Solução:** Normal para usuários com pouca presença digital

### "Fontes usadas: 0/8"
**Causa:** API keys não configuradas
**Solução:** Configure as keys conforme o Passo 2

---

## 💡 Dicas Pro

1. **Para testes:** Use emails corporativos de empresas reais (ex: joao@empresa.pt)
2. **Créditos grátis:** Comece com Hunter.io + Apollo.io + PDL (= 1,085 créditos grátis!)
3. **Melhor cobertura:** Quanto mais APIs configuradas, mais dados você terá
4. **Cache automático:** Dados enriquecidos são salvos, não precisa re-enriquecer
5. **Logs detalhados:** Abra o Console do navegador (F12) para ver o que cada API retorna

---

## 📞 Suporte

**Tem problemas?**
1. Abra o Console do navegador (F12)
2. Vá em "Console"
3. Clique em um usuário
4. Veja os logs detalhados:
   ```
   🔍 ========================================
   🔍 ENRIQUECIMENTO COMPLETO INICIADO
   🔍 Usuário: João Silva <joao@example.com>
   🔍 ========================================
   
   🔍 [1/8] Hunter.io - Verificando email...
   ✅ Hunter.io: Email valid (score: 95)
   
   🔍 [2/8] Apollo.io - Buscando dados profissionais...
   ✅ Apollo.io: CEO @ Tech Corp
   
   ...
   
   ✅ ENRIQUECIMENTO COMPLETO!
   ✅ APIs: 6/8 (75%)
   ✅ Completude: 82%
   ✅ Qualidade: 75%
   ```

5. Se houver erros, eles aparecerão aqui com detalhes

---

**✅ Sistema 100% Funcional para Enriquecimento de Dados Reais da Internet!**

Configure as API keys e aproveite! 🚀
