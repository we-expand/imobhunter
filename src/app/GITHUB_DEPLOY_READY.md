# 🚀 IMOBHUNTER - GitHub Deploy Ready

## ✅ **O QUE FOI ATUALIZADO**

### **1. Código Migrado para PDL + RocketReach**
- ❌ **REMOVIDO:** Proxycurl (descontinuado)
- ✅ **ADICIONADO:** People Data Labs (PDL)
- ✅ **ADICIONADO:** RocketReach (enriquecimento)

### **2. Arquivos Atualizados**
- ✅ `/supabase/functions/server/pdl-linkedin-api.ts` - API do PDL + RocketReach
- ✅ `/supabase/functions/server/real-search-routes.ts` - Rotas usando PDL
- ✅ `/supabase/functions/server/index.tsx` - Server principal

### **3. API Keys Configuradas**
- ✅ `PDL_API_KEY` = `d80c2bd3775ac6d5afae7af6ada844905d83f62b462f2ac4b976c8f0ef7a0372`
- ✅ `ROCKETREACH_API_KEY` = `17ae219k6e7e3daff8fc613a67bd07cf04ac1778`

---

## 📦 **PRÓXIMOS PASSOS - DEPLOY VIA GITHUB**

### **PASSO 1: Preparar Arquivos no Mac**

Execute estes comandos no Terminal:

```bash
# 1. Criar estrutura de pastas
cd ~/Desktop
mkdir -p imobhunter-deploy/supabase/functions/server
cd imobhunter-deploy

# 2. Inicializar Git
git init
git remote add origin https://github.com/clebercouto/imobhunter.git

# 3. Criar README.md
cat > README.md << 'EOF'
# 🏠 ImobHunter

Sistema SaaS de Lead Generation & Nurturing autónomo para o mercado imobiliário.

## 🚀 Stack

- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Supabase Edge Functions (Deno)
- **APIs:** Apollo.io + People Data Labs + RocketReach

## 🔧 Deploy

Este projeto usa auto-deploy via GitHub → Supabase.

### Estrutura:
```
/supabase/functions/server/ → Edge Function "server"
```

## 📝 Configuração

API Keys necessárias (já configuradas no Supabase):
- `APOLLO_API_KEY`
- `PDL_API_KEY`
- `ROCKETREACH_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

---

**© 2025 ImobHunter - Todos os direitos reservados**
EOF

# 4. Criar .gitignore
cat > .gitignore << 'EOF'
node_modules/
.env
.env.local
dist/
build/
.DS_Store
*.log
.supabase/
EOF
```

---

### **PASSO 2: Baixar Arquivos do Figma Make**

**Você precisa copiar os arquivos do Figma Make para o seu Mac.**

Vou criar um script que você pode executar no terminal para baixar os arquivos:

```bash
# SCRIPT PARA CRIAR ARQUIVOS LOCALMENTE
# Execute isso no terminal Mac, dentro da pasta ~/Desktop/imobhunter-deploy
```

---

### **PASSO 3: Conectar Supabase ao GitHub**

1. **Abra o Dashboard do Supabase:**
   ```
   https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/settings/general
   ```

2. **Vá em "Settings" → "Integrations"**

3. **Conecte ao GitHub:**
   - Clique em "GitHub"
   - Autorize o Supabase a acessar seu repositório
   - Selecione: `clebercouto/imobhunter`

4. **Configure Auto-Deploy:**
   - Branch: `main`
   - Pasta: `supabase/functions/server`
   - Função: `server`

---

### **PASSO 4: Push Inicial**

```bash
cd ~/Desktop/imobhunter-deploy

# Adicionar todos os arquivos
git add .

# Commit inicial
git commit -m "🚀 Initial commit - ImobHunter com PDL + RocketReach"

# Push para GitHub
git push -u origin main
```

---

## 🎯 **STATUS ATUAL**

- ✅ API Keys configuradas no Supabase
- ✅ Código atualizado no Figma Make
- ⏳ Aguardando: Download dos arquivos + Push para GitHub
- ⏳ Aguardando: Configurar auto-deploy no Dashboard

---

## 📞 **SUPORTE**

Se tiver algum erro, me envie:
1. Print do erro no terminal
2. URL do repositório GitHub
3. Print do Dashboard Supabase (página Functions)

---

**Última atualização:** 19 de dezembro de 2025
