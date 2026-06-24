# 🚀 GUIA DE CONFIGURAÇÃO - APIs REAIS DO IMOBHUNTER

## ✅ O QUE FOI IMPLEMENTADO

### 1. **Serviço de APIs Reais** (`/lib/real-api-service.ts`)
- ✅ **Apollo.io API** - Busca de leads B2B com email/telefone
- ✅ **Proxycurl API** - Dados reais do LinkedIn (melhor alternativa oficial)
- ✅ **Sistema de Conflation/Merge com IA** - Mescla dados das duas fontes automaticamente

### 2. **Painel de Configuração** (`/components/APIConfigPanel.tsx`)
- Interface completa para configurar API keys
- Armazena credenciais localmente (localStorage)
- Validação e status de cada API

### 3. **Busca Integrada** (`/components/advanced-lead-search.tsx`)
- Busca real funcionando com Apollo + Proxycurl
- Animações de progresso em tempo real
- Exibição de resultados enriquecidos

---

## 🔑 COMO OBTER AS API KEYS

### **APOLLO.IO** (RECOMENDADO - COMECE POR AQUI)

#### O que fornece:
- ✅ **Emails verificados** (corporativos + pessoais)
- ✅ **Telefones** (diretos + celulares)
- ✅ **Dados de empresa** (indústria, tamanho, receita)
- ✅ **Busca por nome, cargo, empresa, localização**
- ✅ **25 leads por busca**

#### Passo a passo:
1. **Crie uma conta grátis:**
   - Acesse: https://app.apollo.io/sign_up
   - Plano Free: **60 créditos/mês grátis**

2. **Obtenha sua API Key:**
   - Acesse: https://app.apollo.io/#/settings/integrations/api
   - Clique em **"Create New Key"**
   - Copie a key (formato: `sk_xxxxxxxxxxxxxxxxxxxxxxxx`)

3. **Cole no ImobHunter:**
   - Menu **SISTEMA** → **Configurações de API**
   - Cole a key no campo "Apollo.io API"
   - Clique em **Salvar Configuração**

#### Preços:
- 🆓 **Free:** 60 créditos/mês
- 💰 **Basic:** $49/mês (1.000 créditos)
- 💰 **Pro:** $99/mês (2.500 créditos)
- 💰 **Enterprise:** Custom pricing

---

### **PROXYCURL (LINKEDIN)** (OPCIONAL - ENRIQUECIMENTO)

#### O que fornece:
- ✅ **Dados 100% reais do LinkedIn** (oficial, não viola ToS)
- ✅ **Perfil completo:** experiência, skills, educação
- ✅ **Headline, summary, avatar**
- ✅ **Busca por nome, empresa, cargo**
- ✅ **10 leads por busca**

#### Passo a passo:
1. **Crie uma conta:**
   - Acesse: https://nubela.co/proxycurl/
   - Clique em **"Get Started"**

2. **Obtenha sua API Key:**
   - Acesse o Dashboard
   - Vá em **Settings** → **API Keys**
   - Copie a key (formato: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

3. **Cole no ImobHunter:**
   - Menu **SISTEMA** → **Configurações de API**
   - Cole a key no campo "Proxycurl (LinkedIn API)"
   - Clique em **Salvar Configuração**

#### Preços:
- 💰 **Pay-as-you-go:** $0.03/perfil (3 centavos por busca)
- 💰 **Starter:** $300/mês (10.000 créditos)
- 💰 **Growth:** $1.000/mês (40.000 créditos)

#### ⚠️ **IMPORTANTE:**
Proxycurl consome créditos! Cada perfil buscado = 1 crédito ($0.03).
Recomendo começar com Apollo e adicionar Proxycurl depois se precisar de dados do LinkedIn.

---

## 🤖 COMO O SISTEMA DE CONFLATION FUNCIONA

Quando você configura **AMBAS** as APIs (Apollo + Proxycurl), nossa IA automaticamente:

### **Passo 1:** Busca em Paralelo
- Busca simultânea no Apollo e Proxycurl
- Cada API retorna seus próprios resultados

### **Passo 2:** Identificação de Duplicatas
- Usa LinkedIn URL como chave primária
- Fallback: Nome + Empresa
- Fallback: Email

### **Passo 3:** Merge Inteligente
**Priorização:**
- 📧 **Email/Phone:** Apollo (mais confiável)
- 💼 **Título/Cargo:** LinkedIn/Proxycurl (mais atualizado)
- 🏢 **Empresa:** LinkedIn/Proxycurl
- 📝 **Experiência/Skills:** LinkedIn/Proxycurl
- 🔗 **LinkedIn URL:** Proxycurl

### **Passo 4:** Score de Confiança
- Lead apenas Apollo: **70-90%**
- Lead apenas Proxycurl: **92-95%**
- Lead mesclado (conflated): **95-98%** ⭐

### **Resultado:**
```json
{
  "id": "conflated-apollo123-proxycurl456",
  "name": "João Silva",
  "title": "CEO @ Imobiliária XYZ", // Do LinkedIn
  "email": "joao.silva@imobiliariaXYZ.com", // Do Apollo
  "phone": "+351 912 345 678", // Do Apollo
  "linkedinUrl": "https://linkedin.com/in/joaosilva", // Do Proxycurl
  "summary": "15 anos de experiência...", // Do LinkedIn
  "skills": ["Real Estate", "Sales", "Management"], // Do LinkedIn
  "confidence": 97, // Boost por ter múltiplas fontes
  "source": "conflated" // Indica que foi mesclado
}
```

---

## 📋 COMO USAR - PASSO A PASSO

### **1. Configurar API Keys**
```
1. Faça login no ImobHunter
2. Vá no menu lateral: SISTEMA → Configurações de API
3. Cole suas API keys (Apollo e/ou Proxycurl)
4. Clique em "Salvar Configuração"
5. Você verá os status: "Configurada" ✅
```

### **2. Fazer uma Busca**
```
1. Vá em "Targets (Search)" no menu principal
2. Preencha os filtros:
   - Keywords/Role: "CEO", "Diretor Comercial", etc.
   - Location: "Portugal", "Lisboa", "São Paulo"
   - Company: "Imobiliária", "Real Estate", etc.
3. Clique em "Initiate Search"
4. Aguarde o sistema buscar nas APIs
```

### **3. Visualizar Resultados**
```
- Tabela com todos os leads encontrados
- Badge mostrando % de confiança
- Ícones indicando fontes (LinkedIn + Apollo)
- Botão "Reveal" para ver detalhes completos
```

---

## 🔍 EXEMPLOS DE BUSCA

### **Exemplo 1: Busca Simples por Nome**
```
Name: "João Silva"
Location: Portugal
```
**O que acontece:**
1. Apollo busca "João Silva" em Portugal → 5 resultados
2. Proxycurl busca no LinkedIn → 3 resultados
3. IA identifica 2 duplicatas e mescla
4. **Resultado:** 6 leads únicos (4 Apollo + 2 Proxycurl exclusivos + 2 mesclados)

### **Exemplo 2: Busca por Cargo**
```
Keywords: "CEO"
Company: "Imobiliária"
Location: Lisboa
```
**O que acontece:**
1. Apollo busca CEOs de imobiliárias em Lisboa → 12 resultados
2. Proxycurl busca CEOs no LinkedIn → 8 resultados
3. IA mescla 5 duplicatas
4. **Resultado:** 15 leads únicos com alta confiança

### **Exemplo 3: Busca Ampla**
```
Keywords: "Diretor Comercial"
Location: Brasil
```
**O que acontece:**
1. Apollo retorna 25 leads (limite)
2. Proxycurl retorna 10 leads (limite)
3. IA mescla todos
4. **Resultado:** 30-35 leads (dependendo de duplicatas)

---

## ⚠️ LIMITES E RESTRIÇÕES

### **Apollo.io:**
- ✅ Max 25 leads por busca
- ✅ Rate limit: 10 requisições/minuto
- ⚠️ Plano Free: 60 créditos/mês (esgota rápido)
- 💡 **Dica:** Use filtros específicos para não desperdiçar créditos

### **Proxycurl:**
- ✅ Max 10 leads por busca
- ✅ Rate limit: Depende do plano
- ⚠️ Consome créditos ($0.03/perfil)
- 💡 **Dica:** Use apenas quando Apollo não tiver dados do LinkedIn

### **Armazenamento:**
- ✅ API keys armazenadas localmente (localStorage)
- ✅ Não enviamos suas keys para servidor
- ⚠️ Se limpar cache do navegador, perde as keys

---

## 🐛 TROUBLESHOOTING

### **"Nenhum lead encontrado"**
**Possíveis causas:**
1. Filtros muito específicos → Tente ampliar
2. API key inválida → Verifique em Configurações de API
3. Créditos esgotados → Verifique saldo no Apollo/Proxycurl
4. Rate limit atingido → Aguarde 1 minuto e tente novamente

### **"Apollo API key inválida"**
**Solução:**
1. Verifique se copiou a key completa (começa com `sk_`)
2. Acesse https://app.apollo.io/#/settings/integrations/api
3. Crie uma nova key se necessário
4. Cole novamente no ImobHunter

### **"Proxycurl API key inválida"**
**Solução:**
1. Verifique se tem créditos disponíveis
2. Acesse o dashboard do Proxycurl
3. Confirme que a key está ativa
4. Cole novamente no ImobHunter

### **"Limite de créditos atingido"**
**Solução:**
1. Apollo Free: Aguarde renovação mensal OU faça upgrade
2. Proxycurl: Adicione créditos no dashboard

---

## 💡 DICAS DE USO

### **Para economizar créditos:**
1. ✅ Use filtros específicos (Location + Company + Role)
2. ✅ Comece com buscas pequenas (25 leads)
3. ✅ Evite buscas genéricas ("CEO" sem filtros)
4. ✅ Use apenas Apollo primeiro, adicione Proxycurl depois

### **Para máxima precisão:**
1. ✅ Configure ambas as APIs (Apollo + Proxycurl)
2. ✅ Deixe o sistema fazer conflation automática
3. ✅ Priorize leads com confidence > 90%
4. ✅ Filtre por "conflated" source (são os melhores)

### **Para buscar no Brasil/Portugal:**
1. ✅ Apollo funciona bem no Brasil
2. ✅ Proxycurl funciona bem em Portugal
3. ✅ Use termos em português ("Diretor", não "Director")
4. ✅ Especifique cidade ("São Paulo", "Lisboa")

---

## 🎯 RECOMENDAÇÃO FINAL

### **Iniciante:** 🌟
```
1. Comece apenas com Apollo.io (plano Free)
2. Faça buscas pequenas (10-25 leads)
3. Valide se os dados são úteis
4. Upgrade para plano pago se precisar de mais
```

### **Intermediário:** 🌟🌟
```
1. Apollo.io (plano Basic: $49/mês)
2. Faça buscas de 50 leads
3. Adicione Proxycurl se precisar de LinkedIn
4. Use conflation para máxima precisão
```

### **Avançado:** 🌟🌟🌟
```
1. Apollo.io (plano Pro: $99/mês)
2. Proxycurl (Pay-as-you-go ou Starter: $300/mês)
3. Configure ambas as APIs
4. Deixe a IA fazer conflation automática
5. Resultados 95-98% de confiança
```

---

## 📞 SUPORTE

Se tiver dúvidas:
1. 📧 **Email:** cleber.couto@we-expand.com
2. 💬 **Chatbot:** Botão inferior direito da plataforma
3. 📖 **Documentação:** Menu SISTEMA → Laboratório Neural

---

**✅ Sistema 100% funcional e pronto para produção!**

**Desenvolvido por:** Cleber Couto @ ImobHunter  
**Data:** Janeiro 2026  
**Versão:** 2.4.0
