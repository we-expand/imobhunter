# 🚀 INSTRUÇÕES DE DEPLOY - BACKEND IMOBHUNTER

## ⚠️ SITUAÇÃO ATUAL

- ✅ Frontend atualizado para usar projeto `nooknoilfqpfzujoddlp`
- ❌ Backend ainda não está deployado nesse projeto
- 🎯 Precisamos deployar a Edge Function `make-server-9e4b8b7c`

---

## 📋 OPÇÕES DE DEPLOY

### **OPÇÃO 1: Usar Supabase CLI (RECOMENDADO)**

```bash
# 1. Instalar Supabase CLI
npm install -g supabase

# 2. Login no Supabase
supabase login

# 3. Link ao projeto
supabase link --project-ref nooknoilfqpfzujoddlp

# 4. Deploy da função
supabase functions deploy make-server-9e4b8b7c
```

**NOTA:** O código fonte está em `/supabase/functions/server/index.tsx` mas precisa estar em `/supabase/functions/make-server-9e4b8b7c/index.ts` para o CLI funcionar.

---

### **OPÇÃO 2: Reestruturar o projeto (MAIS TRABALHO)**

Preciso reorganizar a estrutura de pastas:

```
supabase/
  functions/
    make-server-9e4b8b7c/
      index.ts (código principal)
      kv_store.ts
      search-routes.ts
      ... (outros arquivos)
```

Quer que eu faça isso?

---

### **OPÇÃO 3: Usar apenas imobhunter-api (MAIS SIMPLES)**

Como já temos a `imobhunter-api` deployada, posso:
1. Atualizar o frontend para usar `/imobhunter-api/*`
2. Expandir a `imobhunter-api` com todas as funcionalidades necessárias

**VANTAGEM:** Já está deployada!  
**DESVANTAGEM:** Preciso adicionar mais rotas.

---

## 🎯 MINHA RECOMENDAÇÃO:

**OPÇÃO 3** - Expandir a `imobhunter-api` que já está funcionando.

### O QUE PRECISA:

#### ✅ JÁ FUNCIONA:
- `/imobhunter-api/ping`
- `/imobhunter-api/diagnostics`
- `/imobhunter-api/leads/search`
- `/imobhunter-api/leads/history`
- `/imobhunter-api/leads/search/:searchId`

#### ❌ FALTA ADICIONAR:
- `/imobhunter-api/email/*` (envio de emails)
- `/imobhunter-api/admin/*` (gestão de usuários)
- `/imobhunter-api/linkedin-auth/*` (autenticação LinkedIn)
- `/imobhunter-api/ai-feedback/*` (feedback de leads)
- `/imobhunter-api/excel-import` (importar Excel)

---

## ❓ O QUE VOCÊ PREFERE?

**A)** CLI - Eu reorganizo as pastas, você roda `supabase functions deploy`  
**B)** Expandir `imobhunter-api` - Eu adiciono as rotas faltantes  
**C)** Testar primeiro - Vamos testar se a busca funciona com o que temos  

**👉 ME DIGA E EU IMPLEMENTO!**
