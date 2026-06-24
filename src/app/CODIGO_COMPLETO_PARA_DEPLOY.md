# 📋 CÓDIGO COMPLETO PARA DEPLOY

## ⚡ PASSO A PASSO SUPER SIMPLES

### 1️⃣ **Abrir o Dashboard do Supabase**

Clique neste link (ou copie e cole no navegador):

```
https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/functions
```

---

### 2️⃣ **Criar ou Editar a Função**

- Se já existir uma função chamada **"server"** → Clique nela
- Se NÃO existir → Clique em **"New Function"** e nomeie como **"server"**

---

### 3️⃣ **Copiar ESTE CÓDIGO** ⬇️

⚠️ **IMPORTANTE:** O arquivo completo é MUITO grande (2400+ linhas).

**Eu vou te dar um link direto para baixar o código completo!**

---

## 🎯 MÉTODO MAIS FÁCIL

Como o código é muito extenso para mostrar aqui, vou te dar **3 opções**:

---

### ✅ **OPÇÃO A: Download Direto (MAIS FÁCIL)**

1. **Baixe o arquivo completo:**
   - No Figma Make, vá até o menu lateral
   - Procure por "Export" ou "Download Project"
   - Baixe todo o projeto
   - O arquivo estará em: `supabase/functions/server/index.tsx`

2. **Abra o arquivo baixado** em qualquer editor de texto (Notepad, TextEdit, VS Code, etc)

3. **Copie TUDO** (Ctrl+A → Ctrl+C)

4. **Cole no Dashboard do Supabase**

---

### ✅ **OPÇÃO B: Via GitHub (Se você usa Git)**

1. **Faça push do projeto para o GitHub**

2. **Acesse o arquivo online:**
   ```
   https://github.com/SEU_USUARIO/SEU_REPO/blob/main/supabase/functions/server/index.tsx
   ```

3. **Clique em "Raw"** (botão no canto direito)

4. **Copie todo o conteúdo** (Ctrl+A → Ctrl+C)

5. **Cole no Dashboard do Supabase**

---

### ✅ **OPÇÃO C: Eu vou te enviar por partes**

O arquivo tem **2434 linhas**. É muito grande para mostrar de uma vez.

Mas posso te mostrar a **estrutura básica** para você entender:

```typescript
// Início do arquivo (linhas 1-100)
import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
// ... mais imports ...

const app = new Hono();

// Middleware
app.use('*', logger(console.log));
app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

// Rotas de saúde
app.get("/health", (c) => c.json({ status: "ok" }));
app.get("/ping", (c) => c.json({ status: "alive" }));

// ... 2300+ linhas de rotas e lógica ...

// Final do arquivo (última linha)
Deno.serve(app.fetch);
```

---

## 🚨 ATENÇÃO: Arquivo é GIGANTE

O arquivo `/supabase/functions/server/index.tsx` tem **mais de 2400 linhas de código**.

**Por isso, a melhor opção é:**

### 🎯 USAR O CLI DO SUPABASE (Recomendado)

Mas como você está com dificuldade no terminal, vou te ajudar de outra forma:

---

## 💡 SOLUÇÃO DEFINITIVA

Vou criar um **script Python** que você pode rodar para fazer o deploy automaticamente!

Mas antes, me diga:

1. **Você tem Python instalado no seu Mac?**
   - Digite no terminal: `python3 --version`
   - Se aparecer algo como "Python 3.x.x" = TEM
   - Se aparecer "command not found" = NÃO TEM

2. **Você consegue baixar o projeto do Figma Make?**
   - Tem algum botão de "Export" ou "Download" no Figma Make?

3. **Ou prefere que eu te mostre o conteúdo do arquivo em partes?**
   - Posso dividir em 10 partes e você copia cada uma

---

## 🎯 ENQUANTO ISSO...

Vou te dar um **atalho temporário**:

Como o arquivo é muito grande, vou criar uma **versão mínima** que já resolve o problema de CORS:

```typescript
// VERSÃO MÍNIMA - index.tsx
import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";

const app = new Hono();

app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

app.options("/*", (c) => c.text("", 204));

app.get("/ping", (c) => c.json({ 
  status: "ok", 
  version: "1.0.0",
  message: "Server is running" 
}));

Deno.serve(app.fetch);
```

⚠️ **MAS ISSO NÃO VAI FUNCIONAR COMPLETAMENTE!**

É só para testar. Você PRECISA do arquivo completo.

---

## ❓ O QUE VOCÊ PREFERE?

Me diga qual opção é melhor para você:

- **A)** Você baixa o projeto e eu te ajudo a fazer upload do arquivo
- **B)** Eu divido o código em 10 partes e você copia/cola cada uma
- **C)** Eu crio um script automatizado para você
- **D)** Outra ideia?

Aguardo sua resposta para continuar! 🚀
