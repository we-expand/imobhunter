#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════
# 🚀 QUICK FIX - ImobHunter Auth Deploy
# ═══════════════════════════════════════════════════════════════════════

echo "🔧 ImobHunter - Quick Fix para Autenticação"
echo "════════════════════════════════════════════"
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Verificar se está no diretório correto
echo "📂 Verificando diretório..."
if [ ! -d "supabase/functions/server" ]; then
    echo -e "${RED}❌ Erro: Você não está no diretório ImobHunter${NC}"
    echo "Execute: cd ~/Downloads/ImobHunter"
    exit 1
fi
echo -e "${GREEN}✅ Diretório correto${NC}"
echo ""

# 2. Fazer deploy do servidor
echo "🚀 Fazendo deploy do servidor..."
supabase functions deploy server

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro no deploy${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Deploy concluído${NC}"
echo ""

# 3. Aguardar servidor iniciar
echo "⏳ Aguardando servidor iniciar (30 segundos)..."
for i in {30..1}; do
    echo -ne "${YELLOW}$i... ${NC}\r"
    sleep 1
done
echo -e "${GREEN}✅ Aguarde concluído${NC}"
echo ""

# 4. Testar rota de ping
echo "🔍 Testando rota /ping..."
PING_RESPONSE=$(curl -s -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZHlxbHJzc2dza3RjdGpydXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5Nzk1NzAsImV4cCI6MjA4MTU1NTU3MH0.7Z71n-3HpwqI-T5vrc6XnG-Es_nlWLxDEX2AvqGXzDw" \
https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/ping)

if echo "$PING_RESPONSE" | grep -q "alive"; then
    echo -e "${GREEN}✅ Servidor respondendo!${NC}"
    echo "📊 Resposta: $PING_RESPONSE"
else
    echo -e "${RED}❌ Servidor não está respondendo${NC}"
    echo "📊 Resposta: $PING_RESPONSE"
    exit 1
fi
echo ""

# 5. Testar rota de auth/signup
echo "🔍 Testando rota /auth/signup..."
SIGNUP_RESPONSE=$(curl -s -X POST \
  https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/auth/signup \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZHlxbHJzc2dza3RjdGpydXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5Nzk1NzAsImV4cCI6MjA4MTU1NTU3MH0.7Z71n-3HpwqI-T5vrc6XnG-Es_nlWLxDEX2AvqGXzDw" \
  -d "{\"email\":\"teste-$(date +%s)@exemplo.com\",\"password\":\"123456\",\"name\":\"Teste Usuario\"}")

if echo "$SIGNUP_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ Rota de signup funcionando!${NC}"
    echo "📊 Resposta: $SIGNUP_RESPONSE"
else
    echo -e "${RED}❌ Rota de signup com problema${NC}"
    echo "📊 Resposta: $SIGNUP_RESPONSE"
fi
echo ""

# 6. Instruções finais
echo "════════════════════════════════════════════"
echo -e "${GREEN}🎉 DEPLOY CONCLUÍDO!${NC}"
echo "════════════════════════════════════════════"
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo ""
echo "1. Abra o navegador e acesse sua aplicação"
echo "2. Abra o Console (F12)"
echo "3. Execute: clearOldSessions()"
echo "4. Execute: window.location.reload()"
echo "5. Tente criar uma nova conta e fazer login"
echo ""
echo "📊 Para ver logs em tempo real:"
echo "   supabase functions logs server --follow"
echo ""
echo "🔗 URLs importantes:"
echo "   Ping: https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/ping"
echo "   Auth: https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/auth/signup"
echo ""
