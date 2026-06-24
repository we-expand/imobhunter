# 🚀 Guia de Deploy do ImobHunter - Link de Portfólio Protegido

## 📋 Resumo

Este guia mostra como criar um **link público protegido por senha** do ImobHunter para apresentações de portfólio.

---

## ✅ Opção 1: Deploy no Vercel (RECOMENDADO - 5 minutos)

### **Passo 1: Preparar o Projeto**

1. **Ativar proteção de demo** - Edite `/App.tsx`:
   ```typescript
   const ENABLE_DEMO_PROTECTION = true; // Mude de false para true
   ```

2. **Configurar suas informações** - Edite `/App.tsx`:
   ```typescript
   <DemoGate
     password="imobhunter2024" // Mude para sua senha
     presenterName="Seu Nome"
     contactEmail="seu-email@exemplo.com"
   >
   ```

### **Passo 2: Baixar o Projeto**

No Figma Make, clique em **"Download ZIP"** ou **"Export"**

### **Passo 3: Deploy no Vercel**

```bash
# 1. Instalar Vercel CLI (se ainda não tiver)
npm install -g vercel

# 2. Navegar até a pasta do projeto
cd imobhunter

# 3. Fazer deploy
vercel

# 4. Seguir instruções no terminal:
# - Link to existing project? No
# - Project name? imobhunter (ou o nome que quiser)
# - Directory? ./
# - Build command? npm run build (ou deixar padrão)
# - Output directory? dist (ou deixar padrão)

# 5. Deploy em produção
vercel --prod
```

### **Passo 4: Configurar Variáveis de Ambiente (Opcional)**

Se quiser usar APIs reais, adicione no Vercel Dashboard:

```
VITE_SUPABASE_URL=https://evdyqlrssgsktctjruuq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **Resultado:**
```
✅ URL de produção: https://imobhunter.vercel.app
```

---

## ✅ Opção 2: Deploy no Netlify (Alternativa)

### **Via Interface Web:**

1. Acesse https://app.netlify.com
2. Clique em **"Add new site" → "Deploy manually"**
3. Arraste a pasta do projeto
4. Aguarde deploy (2-3 minutos)

### **Resultado:**
```
✅ URL de produção: https://imobhunter.netlify.app
```

---

## 🔐 Como Funciona a Proteção

### **Tela de Login:**
- Senha padrão: `imobhunter2024`
- Acesso válido por **4 horas** após login
- Session salva no `localStorage`

### **Como Compartilhar:**

**Email para Recrutador:**
```
Assunto: ImobHunter - Demo de Portfólio

Olá [Nome],

Gostaria de compartilhar meu projeto ImobHunter, uma plataforma B2B de 
prospecção inteligente com IA.

🔗 Link: https://imobhunter.vercel.app
🔑 Senha: imobhunter2024

O projeto demonstra:
- React + TypeScript full-stack
- Integração com APIs B2B (Apollo, Proxycurl)
- IA para enriquecimento de dados
- UX premium "Dark Tech"
- 7000+ linhas de código

O acesso é válido por 4 horas após login.

Atenciosamente,
[Seu Nome]
```

---

## 🎨 Customização da Tela de Proteção

### **Mudar Senha:**
```typescript
// App.tsx
<DemoGate password="sua-senha-aqui">
```

### **Mudar Título:**
```typescript
<DemoGate title="Meu Projeto Incrível">
```

### **Mudar Tempo de Sessão:**
```typescript
// DemoGate.tsx - linha 14
const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 horas
```

---

## 🚫 Remover Proteção (Teste Local)

Para testar sem senha localmente:

```typescript
// App.tsx
const ENABLE_DEMO_PROTECTION = false;
```

---

## 📊 Modo Demo vs Modo Produção

### **Modo Demo (padrão):**
- APIs retornam dados mockados realistas
- Sistema funciona 100% offline
- Ideal para apresentações

### **Modo Produção (com APIs reais):**
- Configure as variáveis de ambiente no Vercel
- Adicione `APOLLO_API_KEY` no Supabase
- Leads reais de Apollo + Proxycurl

---

## 🎯 Checklist de Deploy

- [ ] Alterar `ENABLE_DEMO_PROTECTION = true`
- [ ] Configurar senha personalizada
- [ ] Adicionar seu nome e email
- [ ] Baixar projeto do Figma Make
- [ ] Fazer deploy no Vercel/Netlify
- [ ] Testar acesso com senha
- [ ] Compartilhar link com recrutadores

---

## 🆘 Troubleshooting

### **Problema: "Senha não funciona"**
- Verifique se alterou a senha no código
- Limpe localStorage do navegador
- Tente em aba anônima

### **Problema: "Página em branco após login"**
- Verifique console do browser (F12)
- Certifique-se que fez build antes do deploy

### **Problema: "APIs não funcionam"**
- Normal! No modo demo, APIs retornam dados mockados
- Para usar APIs reais, configure variáveis de ambiente

---

## 📱 Links Úteis

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Netlify Dashboard:** https://app.netlify.com
- **Supabase Project:** https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq

---

## 💡 Dicas para Apresentação

### **O Que Mostrar:**
1. ✅ **Landing Page** (design premium)
2. ✅ **Busca Avançada** (filtros múltiplos)
3. ✅ **Resultados** (cards de leads)
4. ✅ **Dashboard Admin** (métricas em tempo real)
5. ✅ **Código-fonte** (abrir GitHub/repo)

### **O Que Enfatizar:**
- "7000+ linhas de código TypeScript"
- "Integração com APIs B2B reais (Apollo, LinkedIn)"
- "IA para deduplicação de dados"
- "100% desenvolvido sozinho em 6 semanas"
- "Pronto para produção"

### **Senhas de Teste (se perguntarem):**
```
Email: demo@imobhunter.com
Senha: demo123
```

---

## 🎉 Resultado Final

Você terá:
- ✅ Link público: `https://imobhunter.vercel.app`
- ✅ Senha de acesso: `imobhunter2024`
- ✅ Proteção por 4 horas de sessão
- ✅ Dados mockados funcionando 100%
- ✅ UX profissional de tier-enterprise

**Compartilhe com orgulho!** 🚀
