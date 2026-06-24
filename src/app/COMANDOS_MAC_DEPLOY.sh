#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════
# 🚀 IMOBHUNTER - SCRIPT DE DEPLOY AUTOMÁTICO VIA GITHUB
# ═══════════════════════════════════════════════════════════════════════
# Execute este script no Terminal Mac para preparar tudo automaticamente
# ═══════════════════════════════════════════════════════════════════════

set -e  # Parar em caso de erro

echo "═══════════════════════════════════════════════════════════════════════"
echo "🚀 IMOBHUNTER - PREPARANDO DEPLOY VIA GITHUB"
echo "═══════════════════════════════════════════════════════════════════════"
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# ═══════════════════════════════════════════════════════════════════════
# PASSO 1: Criar estrutura de pastas
# ═══════════════════════════════════════════════════════════════════════

echo -e "${BLUE}📁 PASSO 1: Criando estrutura de pastas...${NC}"

cd ~/Desktop
rm -rf imobhunter-deploy  # Limpar se já existir
mkdir -p imobhunter-deploy/supabase/functions/server
cd imobhunter-deploy

echo -e "${GREEN}✅ Estrutura criada em: ~/Desktop/imobhunter-deploy${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════════════
# PASSO 2: Inicializar Git
# ═══════════════════════════════════════════════════════════════════════

echo -e "${BLUE}🔧 PASSO 2: Inicializando Git...${NC}"

git init
git branch -M main

echo -e "${GREEN}✅ Git inicializado${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════════════
# PASSO 3: Criar README.md
# ═══════════════════════════════════════════════════════════════════════

echo -e "${BLUE}📝 PASSO 3: Criando README.md...${NC}"

cat > README.md << 'EOF'
# 🏠 ImobHunter

Sistema SaaS de Lead Generation & Nurturing autónomo para o mercado imobiliário português.

## 🚀 Tecnologias

- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Supabase Edge Functions (Deno + Hono)
- **APIs de Dados:**
  - 🎯 **Apollo.io** - B2B Contact Data
  - 💼 **People Data Labs (PDL)** - LinkedIn Data Enrichment  
  - 🚀 **RocketReach** - Contact Enrichment
- **Banco de Dados:** Supabase PostgreSQL (KV Store)
- **Autenticação:** Local Storage (Frontend Only)

## 📂 Estrutura

```
imobhunter/
├── supabase/functions/server/    # Edge Function principal
│   ├── index.tsx                  # Entry point
│   ├── apollo-api.ts              # Apollo.io integration
│   ├── pdl-linkedin-api.ts        # People Data Labs + RocketReach
│   ├── real-search-routes.ts     # Search routes (Apollo + PDL)
│   ├── intelligent-search.ts     # AI-powered search
│   └── ... (outros módulos)
└── README.md
```

## 🔐 Variáveis de Ambiente

As seguintes API keys já estão configuradas no Supabase:

- `APOLLO_API_KEY` - Apollo.io API
- `PDL_API_KEY` - People Data Labs API
- `ROCKETREACH_API_KEY` - RocketReach API
- `SUPABASE_URL` - URL do projeto Supabase
- `SUPABASE_ANON_KEY` - Chave pública
- `SUPABASE_SERVICE_ROLE_KEY` - Chave privada (server-side only)

## 🚀 Deploy

### Via GitHub (Auto-Deploy)

1. **Push para GitHub:**
   ```bash
   git add .
   git commit -m "Update server code"
   git push origin main
   ```

2. **Supabase detecta automaticamente e faz deploy**
   - Função: `server`
   - Endpoint: `https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/server/`

### Via Supabase CLI (Manual)

```bash
supabase functions deploy server --project-ref evdyqlrssgsktctjruuq
```

## 📊 API Endpoints

### Busca de Leads
- `POST /server/make-server-9e4b8b7c/advanced-search` - Busca inteligente (Apollo + PDL)
- `POST /server/make-server-9e4b8b7c/real-search/apollo` - Apollo.io apenas
- `POST /server/make-server-9e4b8b7c/real-search/linkedin` - LinkedIn via PDL
- `POST /server/make-server-9e4b8b7c/real-search/unified` - Busca unificada com ranking

### Admin
- `GET /server/make-server-9e4b8b7c/admin/users` - Listar usuários
- `GET /server/make-server-9e4b8b7c/admin/activities` - Atividades recentes
- `POST /server/make-server-9e4b8b7c/admin/reset-all` - Resetar dados

### Debug
- `GET /server/make-server-9e4b8b7c/ping` - Health check
- `GET /server/make-server-9e4b8b7c/debug/env-vars` - Verificar API keys

## 🧪 Testes

```bash
# Health check
curl https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/server/make-server-9e4b8b7c/ping

# Verificar API keys
curl https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/server/make-server-9e4b8b7c/debug/env-vars
```

## 📝 Changelog

### v1.4.0 (19 Dez 2025)
- ✅ Migração Proxycurl → People Data Labs (PDL)
- ✅ Integração com RocketReach para enriquecimento
- ✅ Algoritmo de scoring e ranking de leads
- ✅ Busca unificada Apollo + PDL com deduplicação

### v1.3.0 (18 Dez 2025)
- ✅ Busca real com Apollo.io + LinkedIn
- ✅ Autenticação local (localStorage)
- ✅ Sistema admin completo

## 👨‍💻 Desenvolvimento

Desenvolvido em **Figma Make** por Cleber Couto.

**Projeto:** ImobHunter  
**ID:** evdyqlrssgsktctjruuq  
**Região:** EU West 3 (Paris)

---

**© 2025 ImobHunter - Todos os direitos reservados**
EOF

echo -e "${GREEN}✅ README.md criado${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════════════
# PASSO 4: Criar .gitignore
# ═══════════════════════════════════════════════════════════════════════

echo -e "${BLUE}🔒 PASSO 4: Criando .gitignore...${NC}"

cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnpm-store/

# Environment variables
.env
.env.local
.env.production

# Build outputs
dist/
build/
.next/
out/

# Logs
*.log
npm-debug.log*
yarn-debug.log*
pnpm-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Supabase local
.supabase/
supabase/.temp/

# Temporary files
*.tmp
.cache/
EOF

echo -e "${GREEN}✅ .gitignore criado${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════════════
# PASSO 5: Criar estrutura deno.json
# ═══════════════════════════════════════════════════════════════════════

echo -e "${BLUE}📦 PASSO 5: Criando deno.json...${NC}"

cat > supabase/functions/server/deno.json << 'EOF'
{
  "tasks": {
    "start": "deno run --allow-net --allow-env index.tsx"
  },
  "imports": {
    "hono": "npm:hono@^3.11.0",
    "@supabase/supabase-js": "npm:@supabase/supabase-js@^2.38.0"
  }
}
EOF

echo -e "${GREEN}✅ deno.json criado${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════════════
# PASSO 6: Informar usuário sobre próximos passos
# ═══════════════════════════════════════════════════════════════════════

echo ""
echo "═══════════════════════════════════════════════════════════════════════"
echo -e "${GREEN}✅ ESTRUTURA PRONTA!${NC}"
echo "═══════════════════════════════════════════════════════════════════════"
echo ""
echo -e "${YELLOW}📂 Localização: ~/Desktop/imobhunter-deploy${NC}"
echo ""
echo -e "${BLUE}🔥 PRÓXIMOS PASSOS CRÍTICOS:${NC}"
echo ""
echo -e "${YELLOW}1️⃣  Copiar arquivos do servidor do Figma Make para a pasta local${NC}"
echo "    Você precisa copiar TODOS os arquivos .ts/.tsx de:"
echo "    Figma Make → ~/Desktop/imobhunter-deploy/supabase/functions/server/"
echo ""
echo -e "${YELLOW}2️⃣  Conectar ao repositório GitHub${NC}"
echo "    Execute:"
echo "    ${GREEN}cd ~/Desktop/imobhunter-deploy${NC}"
echo "    ${GREEN}git remote add origin https://github.com/clebercouto/imobhunter.git${NC}"
echo ""
echo -e "${YELLOW}3️⃣  Fazer commit e push${NC}"
echo "    ${GREEN}git add .${NC}"
echo "    ${GREEN}git commit -m '🚀 Deploy inicial - PDL + RocketReach'${NC}"
echo "    ${GREEN}git push -u origin main${NC}"
echo ""
echo -e "${YELLOW}4️⃣  Configurar Auto-Deploy no Supabase Dashboard${NC}"
echo "    Acesse: https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/settings/integrations"
echo "    - Conecte ao GitHub"
echo "    - Selecione repositório: clebercouto/imobhunter"
echo "    - Branch: main"
echo "    - Deploy automático ativado ✅"
echo ""
echo "═══════════════════════════════════════════════════════════════════════"
echo ""
echo -e "${RED}⚠️  IMPORTANTE: Eu vou te mostrar como copiar os arquivos agora!${NC}"
echo ""
