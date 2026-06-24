# 🚀 DEPLOY VIA CLI - MÉTODO OFICIAL E CORRETO

## ⚡ Por que usar o CLI?

O Supabase CLI faz upload de **TODA a pasta** `/supabase/functions/server/` incluindo:
- ✅ index.tsx (arquivo principal)
- ✅ search-routes.tsx
- ✅ linkedin-routes.ts
- ✅ apollo-api.ts
- ✅ api-proxy-routes.ts
- ✅ ... e TODOS os outros 20+ arquivos

## 📋 PASSO A PASSO (5 MINUTOS)

### 1️⃣ Instalar o Supabase CLI

**Mac/Linux:**
```bash
brew install supabase/tap/supabase
```

**Windows (PowerShell como Admin):**
```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**Alternativa (qualquer SO com NPM):**
```bash
npm install -g supabase
```

### 2️⃣ Baixar o Projeto do Figma Make

- Clique em "Export" ou "Download Project"
- Salve em uma pasta (ex: `~/Downloads/imobhunter/`)

### 3️⃣ Abrir Terminal na Pasta do Projeto

**Mac/Linux:**
```bash
cd ~/Downloads/imobhunter/
```

**Windows (CMD ou PowerShell):**
```cmd
cd C:\Users\SeuNome\Downloads\imobhunter\
```

### 4️⃣ Fazer Login no Supabase

```bash
supabase login
```

- Isso vai abrir o navegador
- Faça login na sua conta Supabase
- Autorize o acesso

### 5️⃣ Deploy da Função

```bash
supabase functions deploy server --project-ref evdyqlrssgsktctjruuq --no-verify-jwt
```

### 6️⃣ Aguardar e Testar

- ⏱️ Aguarde 30-60 segundos
- ✅ Quando ver "Deployed!" = PRONTO!
- 🔄 Recarregue o ImobHunter
- 🎉 Dados REAIS funcionando!

---

## ✅ VANTAGENS DO CLI

- ✅ **Automático**: Faz upload de TODOS os arquivos
- ✅ **Correto**: Mantém a estrutura de pastas
- ✅ **Rápido**: 1 comando só
- ✅ **Seguro**: Sem risco de esquecer arquivos

---

## 🆘 PROBLEMAS COMUNS

### "Command not found: supabase"
→ Reinstale o CLI ou adicione ao PATH

### "Project not found"
→ Verifique se está logado: `supabase login`

### "Permission denied"
→ No Windows, execute o PowerShell como Administrador

---

## 🎯 RESUMO - 1 COMANDO

Depois de instalar o CLI e fazer login:

```bash
supabase functions deploy server --project-ref evdyqlrssgsktctjruuq --no-verify-jwt
```

**PRONTO!** 🚀
