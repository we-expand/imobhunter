#!/bin/bash

echo "═══════════════════════════════════════════════════════════════════════"
echo "🚀 IMOBHUNTER - Deploy Backend para Supabase"
echo "═══════════════════════════════════════════════════════════════════════"
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se Supabase CLI está instalado
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI não encontrado!${NC}"
    echo ""
    echo "Instalando Supabase CLI..."
    npm install -g supabase
    echo ""
fi

# Verificar se está linkado ao projeto
echo -e "${BLUE}🔗 Verificando link com projeto Supabase...${NC}"
supabase link --project-ref evdyqlrssgsktctjruuq 2>/dev/null || true
echo ""

# Fazer deploy da função server
echo -e "${BLUE}📦 Fazendo deploy do Edge Function 'make-server-v2'...${NC}"
cd supabase/functions
supabase functions deploy make-server-v2 --project-ref evdyqlrssgsktctjruuq --no-verify-jwt
cd ../..
echo ""

# Aguardar propagação
echo -e "${YELLOW}⏳ Aguardando 10 segundos para propagação...${NC}"
sleep 10
echo ""

# Testar endpoints
echo -e "${GREEN}✅ Testando configuração das APIs...${NC}"
echo ""

curl -s "https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/server/make-server-9e4b8b7c/debug/env-vars" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZHlxbHJzc2dza3RjdGpydXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5Nzk1NzAsImV4cCI6MjA4MTU1NTU3MH0.7Z71n-3HpwqI-T5vrc6XnG-Es_nlWLxDEX2AvqGXzDw" | python3 -m json.tool 2>/dev/null || echo "⚠️ Endpoint ainda não disponível"

echo ""
echo "═══════════════════════════════════════════════════════════════════════"
echo -e "${GREEN}✅ Deploy concluído!${NC}"
echo "═══════════════════════════════════════════════════════════════════════"
echo ""
echo "📝 Próximos passos:"
echo "  1. Abra o ImobHunter"
echo "  2. Pressione Ctrl+Shift+T"
echo "  3. Clique em 'Diagnóstico Completo'"
echo "  4. Verifique se todas as APIs estão ✅"
echo ""
