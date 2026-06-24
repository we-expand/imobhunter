# 🚀 Guia: Deploy ImobHunter via GitHub

## ✅ Status Atual
- ✅ API Keys configuradas (PDL + RocketReach)
- ⏳ Falta fazer deploy do código atualizado

---

## 📋 **OPÇÃO A: Deploy Manual via Dashboard (Mais Rápido)**

### **1️⃣ Baixar Código do Servidor**

No Figma Make, os arquivos estão em `/supabase/functions/server/`.

Você precisa fazer download destes arquivos principais:
- `index.tsx` (arquivo principal)
- `pdl-linkedin-api.ts` (nova API PDL)
- `apollo-api.ts`
- `diagnostics-routes.ts`
- `env-helper.ts`
- `kv_store.tsx`
- Todos os outros `.ts` e `.tsx` da pasta `/supabase/functions/server/`

### **2️⃣ Criar Repositório GitHub**

1. Vá para: https://github.com/new
2. Nome: `imobhunter`
3. Private ✅
4. Add README ✅
5. Create repository

### **3️⃣ Conectar Supabase ao GitHub**

1. Abra: https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/settings/general

2. Procure por **"GitHub Connection"** ou **"Integrations"**

3. Clique em **"Connect to GitHub"**

4. Autorize o Supabase a acessar seu GitHub

5. Selecione o repositório `imobhunter`

6. Configure:
   - Branch: `main`
   - Production branch: `main`
   - Deploy on push: ✅ Enabled

### **4️⃣ Criar Estrutura de Pastas no GitHub**

No seu repositório, crie esta estrutura:

```
imobhunter/
└── supabase/
    └── functions/
        └── server/
            ├── index.tsx
            ├── pdl-linkedin-api.ts
            ├── apollo-api.ts
            ├── diagnostics-routes.ts
            ├── env-helper.ts
            ├── kv_store.tsx
            └── ... (outros arquivos)
```

### **5️⃣ Fazer Commit e Push**

```bash
git add .
git commit -m "feat: Add PDL + RocketReach APIs"
git push origin main
```

O Supabase fará deploy automaticamente! 🎉

---

## 📋 **OPÇÃO B: Deploy Direto via Dashboard (SEM GitHub)**

### **Mais simples se você não quer configurar GitHub agora:**

1. **Abra:** https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/functions

2. **Se a função "server" já existe:**
   - Clique nos 3 pontinhos (...) ao lado
   - Clique em **"Edit"** ou **"Redeploy"**
   - Aguarde 1-2 minutos

3. **Se a função "server" NÃO existe:**
   - Este é o problema! A função precisa ser criada
   - Continue para o Passo C abaixo

---

## 📋 **OPÇÃO C: Deploy via Supabase CLI (Do Seu Mac)**

### **1️⃣ Baixar Este Projeto no Seu Mac**

Você precisa ter o código localmente. Duas opções:

**A) Se você criou o projeto no Figma Make:**
- O código está apenas no navegador
- Você precisa baixar os arquivos manualmente

**B) Se você já tinha localmente:**
- Procure a pasta no seu Mac
- Execute: `find ~ -name "supabase" -type d 2>/dev/null`

### **2️⃣ Estrutura Necessária**

Crie esta estrutura no seu Mac:

```
~/Desktop/imobhunter/
└── supabase/
    └── functions/
        └── server/
            └── index.tsx (e todos os outros arquivos)
```

### **3️⃣ Execute o Deploy**

```bash
cd ~/Desktop/imobhunter
supabase functions deploy server --project-ref evdyqlrssgsktctjruuq --no-verify-jwt
```

---

## 🎯 **Qual Opção Escolher?**

### **✅ Recomendação por Situação:**

| Situação | Opção Recomendada |
|----------|-------------------|
| Quer setup profissional e futuras atualizações fáceis | **OPÇÃO A** (GitHub) |
| Quer resolver AGORA, rápido | **OPÇÃO B** (Dashboard) |
| Tem o código no Mac | **OPÇÃO C** (CLI) |
| Projeto só existe no Figma Make | **OPÇÃO A** (GitHub) |

---

## ❓ **Próximos Passos**

**Me diga:**
1. Você tem conta no GitHub? (Sim/Não)
2. O projeto ImobHunter existe como repositório GitHub? (Sim/Não/Não sei)
3. Você tem o código no seu Mac ou só no Figma Make? (Mac/Figma Make/Não sei)

Com suas respostas, vou te dar o passo a passo EXATO! 🚀
