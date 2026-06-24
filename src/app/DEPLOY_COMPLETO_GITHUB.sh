#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════
# 🚀 IMOBHUNTER - DEPLOY COMPLETO VIA GITHUB
# ═══════════════════════════════════════════════════════════════════════
# Este script vai:
# 1. Clonar o repositório GitHub
# 2. Copiar TODOS os arquivos do Figma Make
# 3. Fazer commit e push
# 4. Supabase vai detectar e fazer deploy automaticamente
# ═══════════════════════════════════════════════════════════════════════

set -e  # Parar em caso de erro

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "═══════════════════════════════════════════════════════════════════════"
echo "🚀 IMOBHUNTER - DEPLOY AUTOMÁTICO VIA GITHUB"
echo "═══════════════════════════════════════════════════════════════════════"
echo ""

# ═══════════════════════════════════════════════════════════════════════
# PASSO 1: CLONAR REPOSITÓRIO
# ═══════════════════════════════════════════════════════════════════════

echo -e "${BLUE}📥 PASSO 1: Clonando repositório do GitHub...${NC}"

cd ~/Desktop
rm -rf imobhunter  # Limpar se já existir
git clone https://github.com/clebercouto/imobhunter.git
cd imobhunter

echo -e "${GREEN}✅ Repositório clonado${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════════════
# PASSO 2: CRIAR ESTRUTURA
# ═══════════════════════════════════════════════════════════════════════

echo -e "${BLUE}📁 PASSO 2: Criando estrutura de pastas...${NC}"

mkdir -p supabase/functions/server

echo -e "${GREEN}✅ Estrutura criada${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════════════
# PASSO 3: AVISAR USUÁRIO
# ═══════════════════════════════════════════════════════════════════════

echo ""
echo "═══════════════════════════════════════════════════════════════════════"
echo -e "${YELLOW}⚠️  ATENÇÃO - AÇÃO NECESSÁRIA${NC}"
echo "═══════════════════════════════════════════════════════════════════════"
echo ""
echo -e "${RED}❌ PROBLEMA: Não consigo copiar arquivos do Figma Make automaticamente${NC}"
echo ""
echo "O código está no NAVEGADOR (Figma Make), não no seu Mac."
echo ""
echo -e "${BLUE}📋 SOLUÇÃO: Vou criar um INDEX com links para você baixar cada arquivo${NC}"
echo ""
echo "═══════════════════════════════════════════════════════════════════════"
echo ""

# ═══════════════════════════════════════════════════════════════════════
# CRIAR README COM INSTRUÇÕES
# ═══════════════════════════════════════════════════════════════════════

cat > README.md << 'EOFREADME'
# 🏠 ImobHunter

Sistema SaaS de Lead Generation & Nurturing autónomo para o mercado imobiliário.

## 🚀 Stack

- **Frontend:** React + TypeScript + Tailwind CSS  
- **Backend:** Supabase Edge Functions (Deno + Hono)
- **APIs:** Apollo.io + People Data Labs + RocketReach

## 📦 Instalação

```bash
git clone https://github.com/clebercouto/imobhunter.git
cd imobhunter
```

## 🔧 Deploy

Este projeto usa GitHub → Supabase auto-deploy.

Todo push na branch `main` dispara deploy automático da Edge Function `server`.

## 📝 Variáveis de Ambiente

Configuradas no Supabase Dashboard:

- `APOLLO_API_KEY`
- `PDL_API_KEY`
- `ROCKETREACH_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 📞 Suporte

Desenvolvido por Cleber Couto

---

**© 2025 ImobHunter**
EOFREADME

cat > .gitignore << 'EOFGITIGNORE'
node_modules/
.env
.env.local
dist/
build/
.DS_Store
*.log
.supabase/
EOFGITIGNORE

echo -e "${GREEN}✅ README e .gitignore criados${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════════════
# AVISAR QUE PRECISA COPIAR ARQUIVOS MANUALMENTE
# ═══════════════════════════════════════════════════════════════════════

echo ""
echo "═══════════════════════════════════════════════════════════════════════"
echo -e "${YELLOW}📋 PRÓXIMOS PASSOS MANUAIS${NC}"
echo "═══════════════════════════════════════════════════════════════════════"
echo ""
echo "1️⃣  Abra o Figma Make no navegador"
echo ""
echo "2️⃣  Para CADA arquivo em /supabase/functions/server/:"
echo "    - Abra o arquivo"
echo "    - Selecione todo o conteúdo (Cmd+A)"
echo "    - Copie (Cmd+C)"
echo "    - Cole no arquivo correspondente em ~/Desktop/imobhunter/supabase/functions/server/"
echo ""
echo "3️⃣  Depois de copiar TODOS os arquivos, volte aqui e execute:"
echo ""
echo -e "${GREEN}    cd ~/Desktop/imobhunter${NC}"
echo -e "${GREEN}    git add .${NC}"
echo -e "${GREEN}    git commit -m '🚀 Deploy inicial - PDL + RocketReach'${NC}"
echo -e "${GREEN}    git push origin main${NC}"
echo ""
echo "═══════════════════════════════════════════════════════════════════════"
echo ""

echo -e "${BLUE}📂 Pasta do projeto: ~/Desktop/imobhunter${NC}"
echo ""

# Abrir pasta no Finder
open ~/Desktop/imobhunter

echo -e "${GREEN}✅ Pasta aberta no Finder${NC}"
echo ""
