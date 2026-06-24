# 🚀 GITHUB AUTO-DEPLOY - INSTRUÇÕES COMPLETAS

## ✅ **PRÉ-REQUISITOS**
- ✅ Repositório criado: `https://github.com/clebercouto/imobhunter`
- ✅ API Keys configuradas no Supabase
- ✅ Código atualizado com PDL + RocketReach

---

## 📋 **PASSO A PASSO VISUAL**

### **PASSO 1: Criar Estrutura de Pastas no GitHub**

1. **Acesse seu repositório:**
   ```
   https://github.com/clebercouto/imobhunter
   ```

2. **Clique em "Add file" → "Create new file"**

3. **No campo de nome, digite:**
   ```
   supabase/functions/server/.gitkeep
   ```
   
   (O GitHub vai criar automaticamente as pastas)

4. **No conteúdo, escreva:**
   ```
   # Pasta do Edge Function "server"
   ```

5. **Clique em "Commit new file"**

---

### **PASSO 2: Criar Arquivo index.tsx**

1. **Clique em "Add file" → "Create new file"**

2. **Nome do arquivo:**
   ```
   supabase/functions/server/index.tsx
   ```

3. **Conteúdo:** 
   
   👉 **COPIE O CÓDIGO DO ARQUIVO:** `/GITHUB_FILES/index.tsx`
   
   (Vou criar este arquivo em seguida)

4. **Commit message:**
   ```
   🚀 Add server index.tsx
   ```

5. **Clique em "Commit new file"**

---

### **PASSO 3: Adicionar Todos os Outros Arquivos**

Você vai repetir o PASSO 2 para cada arquivo da lista:

📁 **supabase/functions/server/**
- ✅ `index.tsx` (já criado)
- ⏳ `pdl-linkedin-api.ts`
- ⏳ `real-search-routes.ts`
- ⏳ `apollo-api.ts`
- ⏳ `intelligent-search.ts`
- ⏳ `ai-data-merger.ts`
- ⏳ `kv_store.tsx`
- ⏳ `env-helper.ts`
- ⏳ `search-routes.tsx`
- ⏳ `linkedin-routes.ts`
- ⏳ `linkedin-auth-routes.ts`
- ⏳ `diagnostics-routes.ts`
- ⏳ `auth-routes.ts`
- ⏳ `ai-feedback-routes.ts`
- ⏳ `ai-brain-routes.ts`
- ⏳ `excel-import-routes.ts`
- ⏳ `instagram-routes.ts`
- ⏳ `api-test-routes.tsx`
- ⏳ `lead-helpers.ts`
- ⏳ `leads-database.ts`
- ⏳ `demo-leads-generator.ts`
- ⏳ `mock-data.ts`
- ⏳ `web-search-service.ts`
- ⏳ `simple-auth.ts`
- ⏳ `test-startup.ts`

**Total:** 25 arquivos

---

### **PASSO 4: Conectar Supabase ao GitHub**

1. **Abra Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/settings/integrations
   ```

2. **Procure por "GitHub" nas integrações**

3. **Clique em "Connect to GitHub"**

4. **Autorize o Supabase** a acessar seu GitHub

5. **Selecione o repositório:**
   ```
   clebercouto/imobhunter
   ```

6. **Configure:**
   - Branch: `main`
   - Enable auto-deploy: ✅ ON
   - Function: `server`
   - Path: `supabase/functions/server`

7. **Clique em "Save"**

---

### **PASSO 5: Testar o Deploy**

Depois de conectar, o Supabase vai fazer o **primeiro deploy automaticamente**.

**Aguarde 2-3 minutos** e teste:

```bash
curl https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/server/make-server-9e4b8b7c/ping
```

**Resposta esperada:**
```json
{
  "status": "alive",
  "version": "1.4.0 - PDL + RocketReach ✅",
  "timestamp": "2025-12-19T..."
}
```

---

## 🎯 **PRÓXIMOS PASSOS**

Agora vou criar os arquivos prontos para você copiar!

**Aguarde...**
