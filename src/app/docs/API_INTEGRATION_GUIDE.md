# 🚀 IMOBHUNTER - GUIA DE INTEGRAÇÃO DE APIs

## 📋 RESUMO EXECUTIVO

O ImobHunter agora possui **integração completa com APIs REAIS** para busca e enriquecimento de leads B2B no setor imobiliário.

---

## ✅ APIs INTEGRADAS

### 1. **Apollo.io** 🔵
**Status:** Configurável  
**Finalidade:** Busca de leads B2B com email + telefone verificados

**O que fornece:**
- ✅ Emails verificados (corporativos + pessoais)
- ✅ Telefones diretos e celulares
- ✅ Dados básicos de empresa (indústria, tamanho, receita)
- ✅ Cargo, localização, LinkedIn (básico)
- ✅ 25 leads por busca

**Preços:**
- Free: 60 créditos/mês
- Basic: $49/mês (1.000 créditos)
- Professional: $99/mês (12.000 créditos)

**Documentação:** https://apolloio.github.io/apollo-api-docs/

---

### 2. **Proxycurl (Nubela.co)** 🟣
**Status:** ✅ PRÉ-CONFIGURADO  
**API Key:** `c43dba6d0d794c0e8944d5fb05ae87c8`  
**Finalidade:** Dados 100% reais do LinkedIn

**O que fornece:**
- ✅ Perfis completos do LinkedIn
- ✅ Experiência profissional detalhada (histórico completo)
- ✅ Skills validadas + Educação + Certificações
- ✅ Headline, summary, bio profissional
- ✅ Avatar profissional em alta qualidade
- ✅ 10 leads por busca

**Preços:**
- Pay-as-you-go: $0.03/perfil (3 centavos)
- Starter: $300/mês (10.000 créditos)
- Growth: $1.000/mês (40.000 créditos)

**Documentação:** https://nubela.co/proxycurl/docs

---

## 🤖 SISTEMA DE CONFLATION COM IA

### O que faz:
Nosso sistema de **Data Mining com IA** mescla automaticamente dados de múltiplas fontes, removendo duplicatas e priorizando informações mais confiáveis.

### Como funciona:

```
1️⃣ BUSCA PARALELA
   ├─ Apollo.io busca por nome/cargo/empresa
   │  └─ Retorna: Email, Phone, cargo básico
   │
   └─ Proxycurl busca por LinkedIn URL ou nome
      └─ Retorna: Perfil completo, experiência, skills

2️⃣ IDENTIFICAÇÃO DE DUPLICATAS
   ├─ Compara por LinkedIn URL (mais confiável)
   ├─ Compara por Email
   └─ Compara por Nome + Empresa

3️⃣ MERGE INTELIGENTE
   ├─ Email/Phone: PRIORIZA Apollo (mais confiável para contato)
   ├─ Perfil profissional: PRIORIZA LinkedIn (mais atualizado)
   ├─ Skills/Experiência: PRIORIZA LinkedIn (100% real)
   └─ Avatar: PRIORIZA LinkedIn (melhor qualidade)

4️⃣ SCORE DE CONFIANÇA
   ├─ Lead apenas Apollo: 70-90% confidence
   ├─ Lead apenas LinkedIn: 95% confidence
   └─ Lead mesclado (Apollo + LinkedIn): 98% confidence
```

---

## 📊 COMPARAÇÃO: APOLLO vs PROXYCURL

| Feature | **Apollo.io** | **Proxycurl** | **Conflated (IA)** |
|---------|---------------|---------------|-------------------|
| **Email** | ✅ Excelente | ❌ Não | ✅ Do Apollo |
| **Telefone** | ✅ Sim | ❌ Não | ✅ Do Apollo |
| **Cargo atual** | ⚠️ Básico | ✅ Completo | ✅ Do LinkedIn |
| **Experiência** | ❌ Limitado | ✅ Histórico completo | ✅ Do LinkedIn |
| **Skills** | ❌ Não | ✅ Validadas | ✅ Do LinkedIn |
| **Avatar** | ⚠️ Às vezes | ✅ Sempre HD | ✅ Do LinkedIn |
| **Bio/Summary** | ❌ Não | ✅ Completo | ✅ Do LinkedIn |
| **LinkedIn URL** | ⚠️ Às vezes | ✅ Sempre | ✅ Sempre |
| **Custo** | $$ Acessível | $$$ Mais caro | $$$ Apollo + LinkedIn |
| **Confidence** | 70-90% | 95% | **98%** 🏆 |

---

## 🔑 CONFIGURAÇÃO ATUAL

### Proxycurl: ✅ PRÉ-CONFIGURADO
```javascript
API Key: c43dba6d0d794c0e8944d5fb05ae87c8
Status: Ativo e pronto para uso
Créditos: Pay-as-you-go ($0.03/perfil)
```

### Apollo.io: ⚠️ AGUARDANDO CONFIGURAÇÃO
```javascript
API Key: Não configurado
Status: Pendente
Ação necessária: 
  1. Criar conta em https://app.apollo.io
  2. Obter API key em Settings > Integrations > API
  3. Configurar no painel "SISTEMA > Config. APIs"
```

---

## 🚀 COMO USAR

### 1. Busca Simples (apenas LinkedIn)
```typescript
// Buscar por nome
const results = await realAPIService.search({
  name: "João Silva",
  company: "Imobiliária Premium"
});

// Retorna perfis do LinkedIn com dados completos
```

### 2. Busca Completa (Apollo + LinkedIn)
```typescript
// Quando Apollo estiver configurado
const results = await realAPIService.search({
  name: "João Silva",
  title: "CEO",
  company: "Imobiliária Premium",
  location: "Lisboa, Portugal"
});

// Retorna leads 98% enriquecidos (email + phone + perfil completo)
```

### 3. Busca por LinkedIn URL
```typescript
const results = await realAPIService.search({
  linkedinUrl: "https://linkedin.com/in/joaosilva"
});

// Retorna perfil completo do LinkedIn
```

---

## 📈 EXEMPLO DE RESULTADO COMPLETO

```json
{
  "id": "conflated-apollo-123-proxycurl-456",
  "name": "João Silva",
  "firstName": "João",
  "lastName": "Silva",
  "title": "CEO & Founder",
  "company": "Imobiliária Premium Lisboa",
  "companyDomain": "imobiliariapremium.pt",
  "location": "Lisboa, Lisboa, Portugal",
  "country": "Portugal",
  
  "email": "joao.silva@imobiliariapremium.pt",
  "phone": "+351 912 345 678",
  "linkedinUrl": "https://linkedin.com/in/joaosilva",
  "avatar": "https://media.licdn.com/dms/image/...",
  
  "industry": "Real Estate",
  "companySize": "50-100",
  "seniority": "C-Level",
  
  "skills": [
    "Real Estate",
    "Sales",
    "Leadership",
    "Negotiation",
    "Property Management"
  ],
  
  "experience": "CEO @ Imobiliária Premium (2020 - Present) | Diretor Comercial @ RE/MAX Portugal (2015 - 2020) | Consultor Imobiliário @ Century21 (2010 - 2015)",
  
  "summary": "Profissional com 15 anos de experiência no mercado imobiliário português. Especialista em imóveis de luxo e gestão de equipas comerciais. MBA em Gestão Imobiliária pela Universidade de Lisboa.",
  
  "source": "conflated",
  "confidence": 98,
  "lastUpdated": "2026-01-26T10:30:00Z",
  
  "dataQuality": {
    "emailVerified": true,
    "phoneVerified": true,
    "profileComplete": 95
  }
}
```

---

## ⚠️ LIMITES E RESTRIÇÕES

### Apollo.io
- ✅ 25 resultados por busca
- ✅ Rate limit: ~50 req/hora (Free) / ~200 req/hora (Paid)
- ⚠️ Créditos limitados por plano
- ⚠️ API key pode expirar se não usar

### Proxycurl
- ✅ 10 resultados por busca (Person Search)
- ✅ Rate limit: 300 req/min (Starter) / 600 req/min (Growth)
- ⚠️ Usa créditos ($0.03/perfil)
- ⚠️ Cache de 30 dias (dados podem ter até 1 mês)
- ⚠️ `use_cache: false` força dados frescos mas custa 2x

---

## 🔒 SEGURANÇA

### Armazenamento Local
- ✅ API keys armazenadas apenas no **localStorage** do navegador
- ✅ Nunca enviadas para servidores externos (exceto Apollo/Proxycurl)
- ✅ Não compartilhadas com terceiros
- ✅ Criptografadas no localStorage

### Recomendações
1. **Revogue a API key pública** compartilhada anteriormente
2. **Gere nova key** no dashboard do Proxycurl
3. **Use keys com permissões limitadas** (read-only quando possível)
4. **Monitore uso de créditos** regularmente
5. **Nunca compartilhe keys publicamente** (GitHub, chat, etc.)

---

## 🎯 ESTRATÉGIAS DE USO

### Budget Limitado ($0-50/mês)
```
✅ Apenas Proxycurl (Pay-as-you-go)
└─ ~100-150 perfis/mês = $3-5
└─ Bom para testes iniciais
```

### Budget Médio ($50-100/mês)
```
✅ Apollo Basic ($49) + Proxycurl (PAYG ~$10)
├─ 1.000 créditos Apollo
├─ ~100-300 perfis LinkedIn
└─ Total: ~$60-70/mês
└─ Ideal para começar com leads enriquecidos
```

### Budget Profissional ($300-500/mês)
```
✅ Apollo Professional ($99) + Proxycurl Starter ($300)
├─ 12.000 créditos Apollo
├─ 10.000 perfis LinkedIn
└─ Total: ~$400/mês
└─ Escala profissional com conflation completa
```

---

## 📞 SUPORTE

### Apollo.io
- 📧 Email: support@apollo.io
- 💬 Chat: Dentro do dashboard
- 📚 Docs: https://apolloio.github.io/apollo-api-docs/

### Proxycurl
- 📧 Email: hi@nubela.co
- 💬 Chat: https://nubela.co (canto inferior direito)
- 📚 Docs: https://nubela.co/proxycurl/docs

---

## 🎓 PRÓXIMOS PASSOS

1. ✅ **Proxycurl já está configurado e funcional**
2. ⏳ **Configure Apollo.io** para obter email/telefone
3. 🚀 **Teste busca completa** com ambas as APIs
4. 📊 **Monitore créditos** e ajuste estratégia
5. 🔄 **Otimize buscas** para maximizar ROI

---

## 📝 CHANGELOG

### v1.1.0 - 26 Jan 2026
- ✅ Integração completa Proxycurl (LinkedIn)
- ✅ API Key pré-configurada
- ✅ Sistema de Conflation com IA
- ✅ Painel de configuração visual
- ✅ Notificações de status em tempo real
- ✅ Suporte a busca por nome, empresa, cargo, LinkedIn URL

---

**🎯 Resultado Final:** ImobHunter agora possui o sistema mais avançado de Data Mining para leads imobiliários do mercado! 🚀
