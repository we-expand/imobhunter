# 🚀 GITHUB AUTO-DEPLOY - GUIA PASSO A PASSO

## 🎯 **OBJETIVO**
Fazer upload de 25 arquivos do servidor para o GitHub e configurar auto-deploy.

---

## 📋 **MÉTODO SIMPLIFICADO - 3 ETAPAS**

### **ETAPA 1: Upload via GitHub Web (10 minutos)**
### **ETAPA 2: Conectar Supabase ao GitHub (2 minutos)**
### **ETAPA 3: Testar Deploy (1 minuto)**

---

# 🔵 ETAPA 1: UPLOAD DOS ARQUIVOS

## **PASSO 1.1: Acessar Repositório**

1. Abra: https://github.com/clebercouto/imobhunter

2. Clique em **"uploading an existing file"** (link no README)
   
   OU
   
   Clique em **"Add file" → "Upload files"**

---

## **PASSO 1.2: Preparar Estrutura de Pastas**

**PROBLEMA:** GitHub não aceita upload de pastas vazias.

**SOLUÇÃO:** Vamos criar a estrutura via upload direto.

---

## **PASSO 1.3: Criar Arquivos Um a Um**

Infelizmente, o GitHub Web não permite upload de múltiplos arquivos em subpastas.

### **🔥 SOLUÇÃO ALTERNATIVA - USAR GITHUB.DEV (MUITO MAIS RÁPIDO!)**

Vou te ensinar um **ATALHO SECRETO** do GitHub:

1. **Acesse seu repositório:**
   ```
   https://github.com/clebercouto/imobhunter
   ```

2. **Pressione a tecla `.` (ponto) no teclado**
   
   OU
   
   **Mude a URL de `.com` para `.dev`:**
   ```
   https://github.dev/clebercouto/imobhunter
   ```

3. **Um VS Code web vai abrir! 🎉**

---

## **PASSO 1.4: Criar Arquivos no GitHub.dev**

Agora você tem um **editor completo** no navegador!

### **Criar estrutura:**

1. **Clique no ícone de "Nova Pasta"** (primeiro ícone na sidebar)

2. **Digite:**
   ```
   supabase/functions/server
   ```

3. **Pressione Enter**

4. **Agora vou te dar os arquivos para copiar...**

---

# 📁 LISTA DE ARQUIVOS PARA CRIAR

Você vai criar cada arquivo com "Ctrl+N" (ou Cmd+N no Mac) e colar o conteúdo que vou fornecer.

## ✅ **ARQUIVOS CRÍTICOS (ORDEM DE PRIORIDADE)**

### **1️⃣ ARQUIVO 1: index.tsx**

**Caminho completo:** `supabase/functions/server/index.tsx`

**Conteúdo:** 👉 Use o arquivo atual em: `/supabase/functions/server/index.tsx`

---

### **2️⃣ ARQUIVO 2: pdl-linkedin-api.ts**

**Caminho:** `supabase/functions/server/pdl-linkedin-api.ts`

**Conteúdo:** 👉 Use o arquivo atual em: `/supabase/functions/server/pdl-linkedin-api.ts`

---

### **3️⃣ ARQUIVO 3: real-search-routes.ts**

**Caminho:** `supabase/functions/server/real-search-routes.ts`

**Conteúdo:** 👉 Use o arquivo atual em: `/supabase/functions/server/real-search-routes.ts`

---

### **4️⃣ ARQUIVO 4: apollo-api.ts**

**Caminho:** `supabase/functions/server/apollo-api.ts`

**Conteúdo:** 👉 Use o arquivo atual em: `/supabase/functions/server/apollo-api.ts`

---

### **5️⃣ ARQUIVO 5: kv_store.tsx**

**Caminho:** `supabase/functions/server/kv_store.tsx`

**Conteúdo:** 👉 Use o arquivo atual em: `/supabase/functions/server/kv_store.tsx`

---

## 🤔 **WAIT! ISSO VAI DEMORAR MUITO...**

Copiar 25 arquivos manualmente é **IMPRATICÁVEL**.

---

# 💡 **SOLUÇÃO DEFINITIVA: USAR GIT NO TERMINAL MAC**

Em vez de copiar no navegador, vamos fazer via **terminal** que é **10x mais rápido**.

---

## 🚀 **MÉTODO FINAL - GIT + TERMINAL (5 minutos)**

### **PASSO 1: Clonar repositório**

```bash
cd ~/Desktop
git clone https://github.com/clebercouto/imobhunter.git
cd imobhunter
```

---

### **PASSO 2: Criar estrutura**

```bash
mkdir -p supabase/functions/server
```

---

### **PASSO 3: Copiar arquivos**

Agora eu vou criar um **MEGA SCRIPT** que gera TODOS os 25 arquivos automaticamente!

**Aguarde...**

