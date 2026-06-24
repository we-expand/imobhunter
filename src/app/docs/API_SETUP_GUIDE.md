# 🔧 Guia de Configuração de APIs para Lead Generation

Este guia explica como configurar cada API para maximizar a qualidade e quantidade de leads encontrados pelo sistema.

---

## 📊 **Status Atual das APIs**

O sistema está configurado para buscar leads de **4 fontes principais**:

1. ✅ **Apollo.io** - Base primária de leads B2B
2. ✅ **LinkedIn Sales Navigator** (via RapidAPI) - Enriquecimento profissional
3. ✅ **Hunter.io** - Validação e busca de emails
4. ✅ **People Data Labs (PDL)** - Enriquecimento de dados

---

## 1️⃣ **Apollo.io** (PRINCIPAL)

### O que faz:
- Busca leads por nome, cargo, empresa, localização
- Maior base de dados B2B (275M+ contatos)
- Essencial para buscar "Cleber Couto - CEO" ou qualquer nome específico

### Como configurar:

1. **Acesse:** https://app.apollo.io/#/settings/integrations/api
2. **Crie uma conta** (plano gratuito disponível)
3. **Gere uma API Key:**
   - Clique em "Create New Key"
   - Copie a chave gerada
4. **Configure no sistema:**
   - Vá em **Configurações → Segurança**
   - Cole a chave no campo `APOLLO_API_KEY`

### Limites:
- **Gratuito:** 50 créditos/mês (~50 buscas)
- **Pago:** A partir de $49/mês (10,000 créditos)

---

## 2️⃣ **LinkedIn Sales Navigator** (via RapidAPI)

### O que faz:
- Enriquece dados com informações do LinkedIn
- Valida cargos e empresas
- Adiciona headline, conexões, premium status

### Como configurar:

1. **Acesse:** https://rapidapi.com/
2. **Crie uma conta gratuita**
3. **Subscreva à API LinkedIn:**
   - Busque por "LinkedIn API" no marketplace
   - Recomendamos: **"LinkedIn API v2"** ou **"Fresh LinkedIn Profile Data"**
   - Escolha plano (tem gratuito com ~100 requests/mês)
4. **Copie sua RapidAPI Key:**
   - Vá em "My Apps" → "Security"
   - Copie a chave "X-RapidAPI-Key"
5. **Configure no sistema:**
   - Vá em **Configurações → Segurança**
   - Cole a chave no campo `RAPIDAPI_KEY`

### Limites:
- **Gratuito:** 100-500 requests/mês (varia por API)
- **Pago:** A partir de $9/mês

---

## 3️⃣ **Hunter.io**

### O que faz:
- Busca e valida emails profissionais
- Encontra padrões de email de empresas
- Verifica se emails são válidos

### Como configurar:

1. **Acesse:** https://hunter.io/api
2. **Crie uma conta gratuita**
3. **Copie sua API Key:**
   - Dashboard → API → "Your API Key"
4. **Configure no sistema:**
   - Vá em **Configurações → Segurança**
   - Cole a chave no campo `HUNTER_API_KEY`

### Limites:
- **Gratuito:** 25 buscas/mês
- **Pago:** A partir de $49/mês (500 buscas)

---

## 4️⃣ **People Data Labs (PDL)**

### O que faz:
- Maior base de dados de pessoas (3B+ perfis)
- Enriquece com dados demográficos, skills, experiência
- Alta precisão e coverage

### Como configurar:

1. **Acesse:** https://www.peopledatalabs.com/
2. **Crie uma conta e solicite API key**
3. **Configure no sistema:**
   - Vá em **Configurações → Segurança**
   - Cole a chave no campo `PDL_API_KEY`

### Limites:
- **Trial:** 1,000 requests gratuitos
- **Pago:** Custom pricing (entre em contato)

---

## 🔥 **Como o Sistema Funciona com Múltiplas APIs**

### **Enriquecimento Automático:**

Quando você busca **"Cleber Couto - CEO"**, o sistema:

1. **Apollo.io** → Busca o nome exato + cargo
2. **LinkedIn** → Valida informações e adiciona headline/conexões
3. **Hunter.io** → Busca email profissional
4. **PDL** → Enriquece com skills e experiência

### **Merge Inteligente:**

Se Apollo encontrar:
```json
{
  "name": "Cleber Couto",
  "title": "CEO",
  "company": "Empresa ABC",
  "email": "",
  "phone": "+351..."
}
```

E LinkedIn encontrar:
```json
{
  "name": "Cleber Couto",
  "headline": "CEO @ Empresa ABC | Transformando Negócios",
  "connections": 5000,
  "linkedinUrl": "https://linkedin.com/in/clebercouto"
}
```

O sistema **COMBINA automaticamente** em:
```json
{
  "name": "Cleber Couto",
  "title": "CEO",
  "company": "Empresa ABC",
  "email": "",
  "phone": "+351...",
  "linkedinUrl": "https://linkedin.com/in/clebercouto",
  "enrichmentData": {
    "sources": ["apollo", "linkedin"],
    "headline": "CEO @ Empresa ABC | Transformando Negócios",
    "connections": 5000
  },
  "matchScore": 95,
  "confidence": 98
}
```

---

## 📋 **Checklist de Configuração Completa**

- [ ] **Apollo.io** configurado (ESSENCIAL para buscar "Cleber Couto")
- [ ] **RapidAPI** configurado (enriquecimento LinkedIn)
- [ ] **Hunter.io** configurado (emails)
- [ ] **PDL** configurado (opcional mas recomendado)

---

## 🆘 **Troubleshooting**

### **Problema: "Nenhum resultado para Cleber Couto"**

**Solução:**
1. ✅ Verifique se `APOLLO_API_KEY` está configurada
2. ✅ Certifique-se que a API key está **ATIVA** (não expirada)
3. ✅ Tente buscar SEM o nome, apenas: `Cargo: CEO | Empresa: Empresa ABC`
4. ✅ Verifique os logs do Console (F12) para ver qual API retornou erro

### **Problema: "Usando dados DEMO"**

**Solução:**
- Isso significa que **NENHUMA API está configurada** ou todas retornaram erro
- Configure ao menos o Apollo.io para buscar leads reais

### **Problema: "Rate limit excedido"**

**Solução:**
- Você atingiu o limite do plano gratuito
- Aguarde renovação mensal OU
- Faça upgrade para plano pago

---

## 💡 **Dicas de Uso**

### **Para encontrar "Cleber Couto":**
```
✅ Nome: Cleber Couto
✅ Cargo: CEO
❌ Empresa: (deixe vazio se não souber)
```

### **Para encontrar "Todos os CEOs da Tesla":**
```
❌ Nome: (deixe vazio!)
✅ Cargo: CEO
✅ Empresa: Tesla
```

### **Para encontrar "Diretores de TI em Lisboa":**
```
❌ Nome: (deixe vazio!)
✅ Cargo: CTO, CIO, Diretor de TI
✅ Localização: Lisboa, Portugal
```

---

## 📞 **Suporte**

Se tiver dúvidas sobre configuração, verifique:
1. **Logs do Console** (F12 no navegador)
2. **Documentação oficial de cada API**
3. **Mensagens de erro no sistema**

---

**Última atualização:** Dezembro 2024
